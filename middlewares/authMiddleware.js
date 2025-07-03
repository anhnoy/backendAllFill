// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
// const User = require('../models/user'); // ถ้าคุณมี User model
const logger = require('../config/logger');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request (if you have a User model and want to fetch user details)
      // req.user = await User.findByPk(decoded.id);

      next();
    } catch (error) {
      logger.error(`Not authorized, token failed: ${error.message}`);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    logger.warn('Not authorized, no token provided');
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };