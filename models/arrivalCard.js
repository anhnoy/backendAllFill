// backend/models/arrivalCard.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArrivalCardSubmission = sequelize.define('ArrivalCardSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryOfResidence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visaNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cityOfResidence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfArrival: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  countryOfBoarded: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purposeOfTravel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modeOfTravel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modeOfTransport: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  flightNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vesselNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isTransit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  typeOfAccommodation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentSlipUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'arrival_card_submissions',
  timestamps: true,
});

module.exports = ArrivalCardSubmission;