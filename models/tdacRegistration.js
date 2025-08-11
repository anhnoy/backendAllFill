// backend/models/tdacRegistration.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TDACRegistration = sequelize.define('TDACRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  
  // Personal Information
  occupation: {
    type: DataTypes.ENUM('freelancer', 'employee', 'seller'),
    allowNull: false,
  },
  passportPhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'UNDEFINED'),
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visaNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  cityStateOfResidence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  // Travel Information
  dateOfArrival: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  purposeOfTravel: {
    type: DataTypes.ENUM(
      'HOLIDAY', 'MEETING', 'SPORTS', 'BUSINESS', 'INCENTIVE',
      'MEDICAL & WELLNESS', 'EDUCATION', 'CONVENTION', 'EMPLOYMENT',
      'EXHIBITION', 'TRAVEL', 'OTHERS'
    ),
    allowNull: false,
  },
  modeOfTravel: {
    type: DataTypes.ENUM('BUS', 'AIR', 'LAND', 'SEA'),
    allowNull: false,
  },
  modeOfTransport: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for BUS mode
  },
  flightVehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  // Accommodation Information
  isTransitPassenger: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  typeOfAccommodation: {
    type: DataTypes.STRING,
    allowNull: true, // Required only if not transit passenger
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true, // Required only if not transit passenger
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, // Required only if not transit passenger
  },
  
  // Payment Information
  paymentSlipUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  
  // System fields
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  
  // Additional tracking fields
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
  tableName: 'tdac_registrations',
  timestamps: true,
});

module.exports = TDACRegistration;
