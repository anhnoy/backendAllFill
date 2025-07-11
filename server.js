// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const logger = require('./config/logger');
const statusRoutes = require('./routes/statusRoute');
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

app.use('/uploads', cors({
  origin: '*', // อนุญาตทุก origin
}));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static('uploads'));

// Register statusRoutes BEFORE mainRoutes to ensure PATCH /:id/status works
app.use('/api/v1/arrival-card', statusRoutes);
app.use('/api', mainRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => logger.info('✅ Database connection has been established successfully.'))
  .then(() => sequelize.sync())
  .then(() => {
    logger.info('✅ Database synced');
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error(`❌ Unable to connect to DB or sync: ${err.message}`);
    process.exit(1);
  });