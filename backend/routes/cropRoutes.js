const express = require('express');
const router = express.Router();
const {
  getCrops,
  getCropById,
  syncCrops,
  createCrop,
  updateCrop,
  deleteCrop
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCrops);
router.get('/:id', getCropById);

// Protected routes (Admin Only: Only Market Admins can modify official APMC crop prices)
router.post('/sync', protect, authorize('admin'), syncCrops);
router.post('/', protect, authorize('admin'), createCrop);
router.put('/:id', protect, authorize('admin'), updateCrop);
router.delete('/:id', protect, authorize('admin'), deleteCrop);

module.exports = router;
