// backend/middlewares/arrivalCardValidation.js
const { body, param, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validateArrivalCardSubmission = [
  body('firstName').trim().notEmpty().withMessage('First Name is required'),
  body('lastName').trim().notEmpty().withMessage('Last Name is required'),
  body('occupation').trim().notEmpty().withMessage('Occupation is required'),
  body('nationality').trim().notEmpty().withMessage('Nationality/Citizenship is required'),
  body('passportNo').trim().notEmpty().withMessage('Passport No. is required'),
  body('dateOfBirth').isISO8601().toDate().withMessage('Date of Birth must be a valid date (YYYY-MM-DD)'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('countryOfResidence').trim().notEmpty().withMessage('Country/Territory of Residence is required'),
  body('phoneNo').trim().notEmpty().withMessage('Phone No. is required'),
  body('cityOfResidence').trim().notEmpty().withMessage('City/State of Residence is required'),
  body('dateOfArrival').isISO8601().toDate().withMessage('Date of Arrival must be a valid date (YYYY-MM-DD)'),
  body('countryOfBoarded').trim().notEmpty().withMessage('Country/Territory where you Boarded is required'),
  body('purposeOfTravel').trim().notEmpty().withMessage('Purpose of Travel is required'),
  body('modeOfTravel').trim().notEmpty().withMessage('Mode of Travel is required'),

  // Optional fields
  body('visaNo').optional({ checkFalsy: true }).isString().withMessage('Visa No. must be a string'),
  body('modeOfTransport').optional({ checkFalsy: true }).isString().withMessage('Mode of Transport must be a string'),
  body('flightNo').optional({ checkFalsy: true }).isString().withMessage('Flight No. must be a string'),
  body('vehicleNo').optional({ checkFalsy: true }).isString().withMessage('Vehicle No. must be a string'),
  body('vesselNo').optional({ checkFalsy: true }).isString().withMessage('Vessel No. must be a string'),

  // isTransit validation and conditional required fields
  body('isTransit').optional().isBoolean().withMessage('I am a transit passenger status must be a boolean'),
  body('typeOfAccommodation').if(body('isTransit').equals(false)).notEmpty().withMessage('Type of Accommodation is required for non-transit passengers'),
  body('province').if(body('isTransit').equals(false)).notEmpty().withMessage('Province is required for non-transit passengers'),
  body('address').if(body('isTransit').equals(false)).notEmpty().withMessage('Address is required for non-transit passengers'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed for Arrival Card submission: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.mapped()
      });
    }
    next();
  }
];

const validateGetArrivalCardById = [
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn(`Validation failed for GET Arrival Card by ID: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.mapped()
            });
        }
        next();
    }
];


module.exports = {
  validateArrivalCardSubmission,
  validateGetArrivalCardById,
};