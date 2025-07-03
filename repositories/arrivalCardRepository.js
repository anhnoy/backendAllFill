// backend/repositories/arrivalCardRepository.js
const { ArrivalCardSubmission } = require('../models');
const logger = require('../config/logger');

const createArrivalCardSubmission = async (data) => {
  try {
    console.log('Creating Arrival Card submission with data:', data);
    return await ArrivalCardSubmission.create(data);
  } catch (error) {
    logger.error(`Error in createArrivalCardSubmission: ${error.message}`);
    throw error;
  }
};

const getArrivalCardSubmissionById = async (id) => {
  try {
    return await ArrivalCardSubmission.findByPk(id);

  } catch (error) {
    logger.error(`Error in getArrivalCardSubmissionById: ${error.message}`);
    throw error;
  }
};

const getAllArrivalCardSubmissions = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    return await ArrivalCardSubmission.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    logger.error(`Error in getAllArrivalCardSubmissions: ${error.message}`);
    throw error;
  }
};

const updateArrivalCardSubmission = async (id, data) => {
  try {
    const submission = await ArrivalCardSubmission.findByPk(id);
    if (!submission) throw new Error('Arrival Card submission not found');
    await submission.update(data);
    return submission;
  } catch (error) {
    logger.error(`Error in updateArrivalCardSubmission: ${error.message}`);
    throw error;
  }
};

const deleteArrivalCardSubmission = async (id) => {
  try {
    const submission = await ArrivalCardSubmission.findByPk(id);
    if (!submission) throw new Error('Arrival Card submission not found');
    await submission.destroy();
    return true;
  } catch (error) {
    logger.error(`Error in deleteArrivalCardSubmission: ${error.message}`);
    throw error;
  }
};
  
module.exports = {
  createArrivalCardSubmission,
  getArrivalCardSubmissionById,
  getAllArrivalCardSubmissions,
  updateArrivalCardSubmission,
  deleteArrivalCardSubmission,
};