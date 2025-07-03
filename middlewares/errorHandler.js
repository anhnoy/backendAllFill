// backend/middlewares/errorHandler.js
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // ถ้าไม่มี status มาให้เป็น 500
  res.status(statusCode);

  logger.error(`Error: ${err.message}, Status: ${statusCode}, Path: ${req.originalUrl}, Method: ${req.method}, Stack: ${err.stack}`);

  res.json({
    success: false,
    message: err.message,
    // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // แสดง stack trace เฉพาะใน dev mode
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // ส่งต่อไปยัง errorHandler
};

module.exports = {
  errorHandler,
  notFound
};