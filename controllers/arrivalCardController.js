const {
  createArrivalCardSubmission,
  getArrivalCardSubmissionById,
  getAllArrivalCardSubmissions,
  updateArrivalCardSubmission,
  deleteArrivalCardSubmission,
  updateArrivalCardStatus, // ต้องมีใน repositories
} = require('../repositories/arrivalCardRepository');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

const submitArrivalCard = async (req, res) => {
  try {
    const {
      firstName, lastName, occupation, nationality, passportNo,
      dateOfBirth, gender, countryOfResidence, phoneNo, visaNo,
      cityOfResidence, dateOfArrival, countryOfBoarded, purposeOfTravel,
      modeOfTravel, modeOfTransport, flightNo, vehicleNo, vesselNo,
      isTransit,
      typeOfAccommodation, province, address,
    } = req.body;
    console.log('Received Arrival Card submission:', req.body);

    // Always required fields
    const requiredFields = [
      'firstName', 'lastName', 'occupation', 'nationality', 'passportNo',
      'dateOfBirth', 'gender', 'countryOfResidence', 'phoneNo',
      'cityOfResidence', 'dateOfArrival', 'countryOfBoarded', 'purposeOfTravel',
      'modeOfTravel'
    ];

    // Only require accommodation fields if not transit
    const transitValue = isTransit === 'true' || isTransit === true;
    if (!transitValue) {
      requiredFields.push('typeOfAccommodation', 'province', 'address');
    }

    // Only require modeOfTransport if modeOfTravel is not 'BUS'
    if (modeOfTravel !== 'BUS') {
      requiredFields.push('modeOfTransport');
    }

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: 'error',
          message: `${field} is required`
        });
      }
    }

    let paymentSlipUrl = null;
    if (req.file) {
      paymentSlipUrl = `/uploads/${req.file.filename}`;
      logger.info(`File uploaded: ${req.file.filename}`);
    }

    const newSubmission = await createArrivalCardSubmission({
      firstName,
      lastName,
      occupation,
      nationality,
      passportNo,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      countryOfResidence,
      phoneNo,
      visaNo,
      cityOfResidence,
      dateOfArrival: new Date(dateOfArrival),
      countryOfBoarded,
      purposeOfTravel,
      modeOfTravel,
      modeOfTransport: modeOfTravel === 'bus' ? null : modeOfTransport,
      flightNo,
      vehicleNo,
      vesselNo,
      isTransit: transitValue,
      typeOfAccommodation: transitValue ? null : typeOfAccommodation,
      province: transitValue ? null : province,
      address: transitValue ? null : address,
      paymentSlipUrl
    });
    logger.info('New Arrival Card submission created:', newSubmission);
    res.status(201).json({
      status: 'success',
      data: newSubmission
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error in submitArrivalCard: ${error.message}`);

    // If there was a file upload and an error occurred, delete the uploaded file
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your submission'
    });
  }
};

const getArrivalCardDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await getArrivalCardSubmissionById(id);

    if (!submission) {
      res.status(404);
      throw new Error('Arrival Card submission not found.');
    }

    logger.info(`Fetched Arrival Card details for ID: ${id}`);
    res.status(200).json({
      success: true,
      message: 'Arrival Card details fetched successfully!',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

const getAllArrivalCards = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      res.status(400);
      throw new Error('Page and limit must be positive numbers.');
    }

    const { rows: submissions, count: totalItems } = await getAllArrivalCardSubmissions(page, limit);
    const totalPages = Math.ceil(totalItems / limit);

    logger.info(`Fetched all Arrival Cards (page: ${page}, limit: ${limit})`);
    res.status(200).json({
      success: true,
      message: 'Arrival Cards fetched successfully',
      data: submissions,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateArrivalCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateArrivalCardSubmission(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Arrival Card updated successfully!',
      data: updated
    });
  } catch (error) {
    logger.error(`Error updating Arrival Card: ${error.message}`);
    next(error);
  }
};

const deleteArrivalCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteArrivalCardSubmission(id);
    res.status(200).json({
      success: true,
      message: 'Arrival Card deleted successfully!'
    });
  } catch (error) {
    logger.error(`Error deleting Arrival Card: ${error.message}`);
    next(error);
  }
};

// เพิ่มฟังก์ชันสำหรับอัปเดต status
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }
    const updated = await updateArrivalCardStatus(id, status);
    res.json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitArrivalCard,
  getArrivalCardDetails,
  getAllArrivalCards,
  updateArrivalCard,
  deleteArrivalCard,
  updateStatus, // export เพิ่มตรงนี้
};