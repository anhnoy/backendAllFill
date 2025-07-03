// backend/models/index.js
const sequelize = require('../config/database');
const Admin = require('./admin'); 
const ArrivalCardSubmission = require('./arrivalCard'); // 



const models = {
  Admin,
  ArrivalCardSubmission, 
};

module.exports = {
  sequelize,
  ...models
};