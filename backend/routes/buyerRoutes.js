const express = require('express');
const router = express.Router();
const {
  getBuyers,
  createBuyer,
  deleteBuyer
} = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBuyers);

// Protected routes
router.post('/', protect, createBuyer);
router.delete('/:id', protect, deleteBuyer);

module.exports = router;
