const upload = require('../middlewares/upload');
const express = require('express');
const { submitArrivalCard, getArrivalCardDetails, getAllArrivalCards, updateArrivalCard, deleteArrivalCard } = require('../controllers/arrivalCardController');
const router = express.Router();

// Add your routes here
router.post('/submit', upload.single('paymentSlip'), submitArrivalCard);

// Get arrival card by ID
router.get('/:id', getArrivalCardDetails);

// Get all arrival cards
router.get('/', getAllArrivalCards);

// Edit (update) arrival card by ID
router.put('/:id', updateArrivalCard);

// Delete arrival card by ID
router.delete('/:id', deleteArrivalCard);

module.exports = router;