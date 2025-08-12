// backend/models/arrivalCard.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArrivalCard = sequelize.define('ArrivalCard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  
  // Personal Information
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: false,
  },
  
  // Travel Information
  arrivalDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  flightNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fromCountry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purposeOfVisit: {
    type: DataTypes.ENUM(
      'TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'MEDICAL', 'OTHER'
    ),
    allowNull: false,
  },
  
  // Accommodation Information
  accommodationType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accommodationAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Processing Information
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'arrival_cards',
  timestamps: true,
});

module.exports = ArrivalCard;
