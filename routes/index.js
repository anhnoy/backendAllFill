// backend/routes/index.js
const express = require('express');
const adminRoutes = require('./adminRoute'); // Import Admin Router
const tdacRoutes = require('./tdacRoute'); // Import TDAC Router
const arrivalCardRoutes = require('./arrivalCardRoute'); // Import Arrival Card Router

const router = express.Router(); // สร้าง Express Router Instance

// กำหนด prefix ให้กับแต่ละ Router
router.use('/admin', adminRoutes); // ทำให้ route ของ adminRoute.js เป็น /admin/...
router.use('/tdac', tdacRoutes); // ทำให้ route ของ tdacRoute.js เป็น /tdac/...
router.use('/v1/arrival-card', arrivalCardRoutes); // ทำให้ route ของ arrivalCardRoute.js เป็น /v1/arrival-card/...

module.exports = router; // Export Router หลักนี้ออกไป