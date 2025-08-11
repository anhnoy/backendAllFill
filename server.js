// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const logger = require('./config/logger');
require('dotenv').config();

require('./models');

const { notFound, errorHandler } = require('./middlewares/errorHandler');
const mainRoutes = require('./routes/index');

const app = express();

app.use(helmet({
    referrerPolicy: { policy: "no-referrer-when-downgrade" }
}));

app.use(cors({
    origin: '*', // สำหรับการพัฒนา, ควรเปลี่ยนเป็น URL ของ Frontend ใน production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Main API routes - admin login functionality + TDAC registration
app.use('/api', mainRoutes);

// Test route to verify TDAC functionality
app.get('/api/tdac/test', (req, res) => {
  res.json({ message: 'TDAC routes working directly!' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => logger.info('✅ Database connection has been established successfully.'))
  .then(() => {
    // Use force: false to avoid recreating tables and reduce conflicts
    return sequelize.sync({ force: false }); 
  })
  .then(() => {
    logger.info('✅ Database synced');
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error(`❌ Unable to connect to DB or sync: ${err.message}`);
    // Don't exit process, try to start server anyway
    logger.info(`🚀 Starting server anyway on port ${PORT}`);
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT} (without DB sync)`));
  });