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
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCrops);
router.get('/:id', getCropById);

// Protected routes
router.post('/sync', protect, syncCrops);
router.post('/', protect, createCrop);
router.put('/:id', protect, updateCrop);
router.delete('/:id', protect, deleteCrop);

module.exports = router;
