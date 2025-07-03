// backend/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // ระดับ log ที่จะบันทึก (error, warn, info, http, verbose, debug, silly)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
    // winston.format.json() // ถ้าต้องการ JSON format
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
      )
    }), // แสดง log ใน console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // บันทึก error ลงไฟล์
    new winston.transports.File({ filename: 'logs/combined.log' }), // บันทึก log ทั้งหมดลงไฟล์
  ],
});

module.exports = logger;