// backend/routes/tdacRoute.js
const express = require('express');
const { 
  createTDACRegistration, 
  getTDACRegistrationById, 
  getAllTDACRegistrations, 
  updateTDACRegistrationStatus 
} = require('../controllers/tdacController');
const { upload, handleMulterError } = require('../middlewares/upload');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'TDAC routes working!' });
});

/**
 * @route POST /api/tdac/register
 * @desc Create new TDAC registration
 * @body Registration data with optional file uploads (passportPhoto, paymentSlip)
 * @access Public
 */
router.post('/register', 
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'paymentSlip', maxCount: 1 }
  ]),
  handleMulterError,
  createTDACRegistration
);

/**
 * @route GET /api/tdac/registration/:id
 * @desc Get TDAC registration by ID
 * @param id - Registration UUID
 * @access Public (user can check their own registration)
 */
router.get('/registration/:id', getTDACRegistrationById);

/**
 * @route GET /api/tdac/admin/registrations
 * @desc Get all TDAC registrations (Admin only)
 * @query page, limit, status
 * @access Private (Admin only)
 */
router.get('/admin/registrations', protect, getAllTDACRegistrations);

/**
 * @route PATCH /api/tdac/admin/registration/:id/status
 * @desc Update registration status (Admin only)
 * @param id - Registration UUID
 * @body { status: 'PENDING' | 'APPROVED' | 'REJECTED', notes?: string }
 * @access Private (Admin only)
 */
router.patch('/admin/registration/:id/status', protect, updateTDACRegistrationStatus);

/**
 * @route GET /api/tdac/admin/stats
 * @desc Get registration statistics (Admin only)
 * @access Private (Admin only)
 */
router.get('/admin/stats', protect, async (req, res) => {
  try {
    const TDACRegistration = require('../models/tdacRegistration');
    
    const totalRegistrations = await TDACRegistration.count();
    const pendingCount = await TDACRegistration.count({ where: { status: 'PENDING' } });
    const approvedCount = await TDACRegistration.count({ where: { status: 'APPROVED' } });
    const rejectedCount = await TDACRegistration.count({ where: { status: 'REJECTED' } });
    
    // Get registrations by occupation
    const occupationStats = await TDACRegistration.findAll({
      attributes: [
        'occupation',
        [TDACRegistration.sequelize.fn('COUNT', TDACRegistration.sequelize.col('occupation')), 'count']
      ],
      group: ['occupation']
    });
    
    // Get recent registrations
    const recentRegistrations = await TDACRegistration.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'status', 'createdAt', 'occupation']
    });

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        summary: {
          total: totalRegistrations,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount
        },
        occupationBreakdown: occupationStats.reduce((acc, item) => {
          acc[item.occupation] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        recentRegistrations: recentRegistrations
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;
