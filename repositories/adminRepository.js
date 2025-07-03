// backend/routes/adminRoute.js (ตัวอย่างที่ถูกต้อง)
const express = require('express'); // <-- ต้อง import express
const adminController = require('../controllers/adminController'); // <-- ต้อง import controller
const { protect } = require('../middlewares/authMiddleware'); // <-- อาจมี middleware

const router = express.Router(); // <-- ต้องสร้าง Express Router instance

// กำหนดเส้นทาง API สำหรับ Admin
router.post('/login', adminController.login);
router.get('/dashboard', protect, adminController.getDashboardData); // หรือเส้นทางอื่นๆ

module.exports = router; // <-- และต้อง export router ตัวนี้ออกไป