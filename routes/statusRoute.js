const express = require('express');
const { updateStatus } = require('../controllers/arrivalCardController');
const router = express.Router();

router.patch('/:id/status', updateStatus);

module.exports = router;