const express = require('express');
const router = express.Router();
const {
  getSchemes,
  createScheme,
  deleteScheme
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getSchemes);

// Protected routes
router.post('/', protect, createScheme);
router.delete('/:id', protect, deleteScheme);

module.exports = router;
