// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser'); 
const sequelize = require('./config/database');
const logger = require('./config/logger');
require('dotenv').config();


require('./models');

const { notFound, errorHandler } = require('./middlewares/errorHandler');
const mainRoutes = require('./routes/index'); // 

const app = express();

app.use(helmet({
    referrerPolicy: { policy: "no-referrer-when-downgrade" }
}));

app.use(cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    // credentials: true, 
    origin: '*', // สำหรับการพัฒนา, ควรเปลี่ยนเป็น URL ของ Frontend ใน production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/uploads', cors({
  origin: '*', // อนุญาตทุก origin
  // ห้ามใส่ credentials: true ถ้าใช้ origin: '*'
}));
// เพิ่ม header Cross-Origin-Resource-Policy: cross-origin ให้ static file
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static('uploads'));


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