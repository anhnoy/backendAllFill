// backend/routes/arrivalCardRoute.js
const express = require('express');
const { 
  submitArrivalCard, 
  getArrivalCardById, 
  getAllArrivalCards, 
  updateArrivalCardStatus 
} = require('../controllers/arrivalCardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Arrival Card routes working!' });
});

/**
 * @route POST /api/v1/arrival-card/submit
 * @desc Submit new arrival card
 * @body Arrival card data
 * @access Public
 */
router.post('/submit', submitArrivalCard);

/**
 * @route GET /api/v1/arrival-card/:id
 * @desc Get arrival card by ID
 * @param id - Arrival card UUID
 * @access Public (user can check their own card)
 */
router.get('/:id', getArrivalCardById);

/**
 * @route GET /api/v1/arrival-card/admin/all
 * @desc Get all arrival cards (Admin only)
 * @query page, limit, status
 * @access Private (Admin only)
 */
router.get('/admin/all', protect, getAllArrivalCards);

/**
 * @route PATCH /api/v1/arrival-card/admin/:id
 * @desc Update arrival card status (Admin only)
 * @param id - Arrival card UUID
 * @body { status: 'PENDING' | 'APPROVED' | 'REJECTED', notes?: string }
 * @access Private (Admin only)
 */
router.patch('/admin/:id', protect, updateArrivalCardStatus);

module.exports = router;
