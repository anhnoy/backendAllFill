// backend/controllers/arrivalCardController.js
const ArrivalCard = require('../models/arrivalCard');
const logger = require('../config/logger');

// Submit new arrival card
const submitArrivalCard = async (req, res) => {
  try {
    const {
      firstName, lastName, nationality, passportNumber, dateOfBirth, gender,
      arrivalDate, flightNumber, fromCountry, purposeOfVisit,
      accommodationType, accommodationAddress, contactNumber
    } = req.body;

    console.log('Received arrival card submission:', req.body);

    // Validation for required fields
    const requiredFields = [
      'firstName', 'lastName', 'nationality', 'passportNumber', 
      'dateOfBirth', 'gender', 'arrivalDate', 'fromCountry', 'purposeOfVisit'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate ENUM values
    const validGenders = ['MALE', 'FEMALE', 'OTHER'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender value'
      });
    }

    const validPurposes = ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'MEDICAL', 'OTHER'];
    if (!validPurposes.includes(purposeOfVisit)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose of visit'
      });
    }

    // Prepare arrival card data
    const arrivalCardData = {
      firstName,
      lastName,
      nationality,
      passportNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      arrivalDate: new Date(arrivalDate),
      flightNumber: flightNumber || null,
      fromCountry,
      purposeOfVisit,
      accommodationType: accommodationType || null,
      accommodationAddress: accommodationAddress || null,
      contactNumber: contactNumber || null,
      status: 'PENDING'
    };

    const newArrivalCard = await ArrivalCard.create(arrivalCardData);

    logger.info('New arrival card submitted:', newArrivalCard.id);
    res.status(201).json({
      success: true,
      message: 'Arrival card submitted successfully',
      data: {
        id: newArrivalCard.id,
        status: newArrivalCard.status,
        submittedAt: newArrivalCard.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error in submitArrivalCard: ${error.message}`);

    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your arrival card',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get arrival card by ID
const getArrivalCardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Arrival card ID is required'
      });
    }

    const arrivalCard = await ArrivalCard.findByPk(id);

    if (!arrivalCard) {
      return res.status(404).json({
        success: false,
        message: 'Arrival card not found'
      });
    }

    logger.info(`Fetched arrival card for ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Arrival card retrieved successfully',
      data: arrivalCard
    });
  } catch (error) {
    logger.error(`Error in getArrivalCardById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the arrival card',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all arrival cards (Admin only)
const getAllArrivalCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.status = status;
    }

    const { rows: arrivalCards, count: totalItems } = await ArrivalCard.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(totalItems / limit);

    logger.info(`Fetched ${arrivalCards.length} arrival cards (page: ${page}, limit: ${limit})`);
    res.status(200).json({
      success: true,
      message: 'Arrival cards retrieved successfully',
      data: arrivalCards,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    logger.error(`Error in getAllArrivalCards: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving arrival cards',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update arrival card status (Admin only)
const updateArrivalCardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Arrival card ID is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const arrivalCard = await ArrivalCard.findByPk(id);
    if (!arrivalCard) {
      return res.status(404).json({
        success: false,
        message: 'Arrival card not found'
      });
    }

    await arrivalCard.update({
      status,
      notes: notes || null,
      processedAt: new Date()
    });

    // Refresh the data to get updated values
    await arrivalCard.reload();

    logger.info(`Arrival card status updated: ${id} -> ${status}`);
    res.status(200).json({
      success: true,
      message: `Arrival card status updated to ${status}`,
      data: arrivalCard
    });
  } catch (error) {
    logger.error(`Error in updateArrivalCardStatus: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  submitArrivalCard,
  getArrivalCardById,
  getAllArrivalCards,
  updateArrivalCardStatus,
};
