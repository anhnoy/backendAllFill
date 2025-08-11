// backend/routes/index.js
const express = require('express');
const adminRoutes = require('./adminRoute'); // Import Admin Router
const tdacRoutes = require('./tdacRoute'); // Import TDAC Router

const router = express.Router(); // สร้าง Express Router Instance

// กำหนด prefix ให้กับแต่ละ Router
router.use('/admin', adminRoutes); // ทำให้ route ของ adminRoute.js เป็น /admin/...
router.use('/tdac', tdacRoutes); // ทำให้ route ของ tdacRoute.js เป็น /tdac/...

module.exports = router; // Export Router หลักนี้ออกไป