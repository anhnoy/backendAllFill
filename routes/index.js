// backend/routes/index.js
const express = require('express');
const adminRoutes = require('./adminRoute'); // Import Admin Router
const arrivalCardRoutes = require('./arrivalCardRoutes'); // Import Arrival Card Router

const router = express.Router(); // สร้าง Express Router Instance

// กำหนด prefix ให้กับแต่ละ Router ย่อย
router.use('/admin', adminRoutes); // ทำให้ route ของ adminRoute.js เป็น /admin/...
router.use('/v1/arrival-card', arrivalCardRoutes); // ทำให้ route ของ arrivalCardRoutes.js เป็น /v1/arrival-card/...

module.exports = router; // Export Router หลักนี้ออกไป