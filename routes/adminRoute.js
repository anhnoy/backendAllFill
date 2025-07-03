// backend/routes/adminRoute.js
const express = require('express');
const { getDashboardData, login } = require('../controllers/adminController'); // Import functions จาก AdminController
const { protect } = require('../middlewares/authMiddleware'); // Import middleware protect (ถ้าใช้)

const router = express.Router(); // สร้าง Express Router Instance

// กำหนด route สำหรับ Admin
router.post('/login', login); // Route Login
router.get('/dashboard', protect, getDashboardData); // Route Dashboard ที่มีการป้องกัน
router.get('/test', (req, res) => res.json({ status: 'ok' }));

module.exports = router; // Export Router นี้ออกไป