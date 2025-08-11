// backend/models/index.js
const sequelize = require('../config/database');
const Admin = require('./admin'); 
const TDACRegistration = require('./tdacRegistration');

const models = {
  Admin,
  TDACRegistration,
};

module.exports = {
  sequelize,
  ...models
};