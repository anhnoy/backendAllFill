// backend/controllers/tdacController.js
const TDACRegistration = require('../models/tdacRegistration');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

// Create new TDAC registration
const createTDACRegistration = async (req, res) => {
  try {
    const {
      occupation, gender, phoneNumber, visaNumber, cityStateOfResidence,
      dateOfArrival, purposeOfTravel, modeOfTravel, modeOfTransport, 
      flightVehicleNumber, isTransitPassenger, typeOfAccommodation, 
      province, address
    } = req.body;

    console.log('Received TDAC registration:', req.body);
    console.log('Files received:', req.files);

    // Validation for required fields
    const requiredFields = [
      'occupation', 'gender', 'phoneNumber', 'cityStateOfResidence',
      'dateOfArrival', 'purposeOfTravel', 'modeOfTravel', 'flightVehicleNumber'
    ];

    // Add modeOfTransport validation only if not BUS
    if (modeOfTravel && modeOfTravel !== 'BUS') {
      requiredFields.push('modeOfTransport');
    }

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate if accommodation fields are required (not transit passenger)
    if (isTransitPassenger !== 'true' && isTransitPassenger !== true) {
      const accommodationFields = ['typeOfAccommodation', 'province', 'address'];
      for (const field of accommodationFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required for non-transit passengers`
          });
        }
      }
    }

    // Validate ENUM values
    const validOccupations = ['freelancer', 'employee', 'seller'];
    if (!validOccupations.includes(occupation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid occupation value'
      });
    }

    const validGenders = ['MALE', 'FEMALE', 'UNDEFINED'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender value'
      });
    }

    const validModeOfTravel = ['BUS', 'AIR', 'LAND', 'SEA'];
    if (!validModeOfTravel.includes(modeOfTravel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mode of travel'
      });
    }

    const validPurposes = [
      'HOLIDAY', 'MEETING', 'SPORTS', 'BUSINESS', 'INCENTIVE',
      'MEDICAL & WELLNESS', 'EDUCATION', 'CONVENTION', 'EMPLOYMENT',
      'EXHIBITION', 'TRAVEL', 'OTHERS'
    ];
    if (!validPurposes.includes(purposeOfTravel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose of travel'
      });
    }

    // Handle file uploads (Version เดิม + รับ URLs จาก body)
    let passportPhotoUrl = req.body.passportPhotoUrl || null;
    let paymentSlipUrl = req.body.paymentSlipUrl || null;
    
    if (req.files) {
      if (req.files.passportPhoto && req.files.passportPhoto[0]) {
        passportPhotoUrl = `/uploads/${req.files.passportPhoto[0].filename}`;
        logger.info(`Passport photo uploaded: ${req.files.passportPhoto[0].filename}`);
      }
      if (req.files.paymentSlip && req.files.paymentSlip[0]) {
        paymentSlipUrl = `/uploads/${req.files.paymentSlip[0].filename}`;
        logger.info(`Payment slip uploaded: ${req.files.paymentSlip[0].filename}`);
      }
    }

    // Prepare registration data
    const registrationData = {
      occupation,
      passportPhotoUrl,
      gender,
      phoneNumber,
      visaNumber: visaNumber || null,
      cityStateOfResidence,
      dateOfArrival: new Date(dateOfArrival),
      purposeOfTravel,
      modeOfTravel,
      modeOfTransport: (modeOfTravel === 'BUS') ? null : modeOfTransport,
      flightVehicleNumber,
      isTransitPassenger: isTransitPassenger === 'true' || isTransitPassenger === true,
      typeOfAccommodation: (isTransitPassenger === 'true' || isTransitPassenger === true) ? null : typeOfAccommodation,
      province: (isTransitPassenger === 'true' || isTransitPassenger === true) ? null : province,
      address: (isTransitPassenger === 'true' || isTransitPassenger === true) ? null : address,
      paymentSlipUrl,
      status: 'PENDING'
    };

    const newRegistration = await TDACRegistration.create(registrationData);

    logger.info('New TDAC registration created:', newRegistration.id);
    res.status(201).json({
      success: true,
      message: 'TDAC registration submitted successfully',
      data: {
        id: newRegistration.id,
        status: newRegistration.status,
        submittedAt: newRegistration.createdAt,
        passportPhotoUrl: newRegistration.passportPhotoUrl,  // ✅ เพิ่มเฉพาะ file URLs
        paymentSlipUrl: newRegistration.paymentSlipUrl       // ✅ เพิ่มเฉพาะ file URLs
      }
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error in createTDACRegistration: ${error.message}`);

    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        fs.unlink(filePath, (err) => {
          if (err) logger.error(`Error deleting file: ${err.message}`);
        });
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get registration by ID
const getTDACRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required'
      });
    }

    const registration = await TDACRegistration.findByPk(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'TDAC registration not found'
      });
    }

    logger.info(`Fetched TDAC registration for ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'TDAC registration retrieved successfully',
      data: registration
    });
  } catch (error) {
    logger.error(`Error in getTDACRegistrationById: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all registrations (Admin only)
const getAllTDACRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.status = status;
    }

    const { rows: registrations, count: totalItems } = await TDACRegistration.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(totalItems / limit);

    logger.info(`Fetched ${registrations.length} TDAC registrations (page: ${page}, limit: ${limit})`);
    res.status(200).json({
      success: true,
      message: 'TDAC registrations retrieved successfully',
      data: registrations,
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
    logger.error(`Error in getAllTDACRegistrations: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving registrations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update registration status (Admin only)
const updateTDACRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required'
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

    const registration = await TDACRegistration.findByPk(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'TDAC registration not found'
      });
    }

    await registration.update({
      status,
      notes: notes || null,
      processedAt: new Date()
    });

    logger.info(`TDAC registration status updated: ${id} -> ${status}`);
    res.status(200).json({
      success: true,
      message: `Registration status updated to ${status}`,
      data: {
        id: registration.id,
        status: registration.status,
        processedAt: registration.processedAt
      }
    });
  } catch (error) {
    logger.error(`Error in updateTDACRegistrationStatus: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createTDACRegistration,
  getTDACRegistrationById,
  getAllTDACRegistrations,
  updateTDACRegistrationStatus,
};
