// backend/models/index.js
const sequelize = require('../config/database');
const Admin = require('./admin'); 
const TDACRegistration = require('./tdacRegistration');
const ArrivalCard = require('./arrivalCard');

const models = {
  Admin,
  TDACRegistration,
  ArrivalCard,
};

module.exports = {
  sequelize,
  ...models
};