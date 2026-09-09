const express = require('express');
const router = express.Router();
const { getAiAdvice } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');

// AI crop advice route (with optional user context)
router.post('/text', optionalProtect, getAiAdvice);

module.exports = router;
