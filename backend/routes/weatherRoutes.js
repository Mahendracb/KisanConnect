const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../controllers/weatherController');

// Public weather & smart spray advisory route
router.get('/', getWeatherData);

module.exports = router;
