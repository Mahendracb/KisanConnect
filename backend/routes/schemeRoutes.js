const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// @route GET /api/schemes
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;

    const schemes = await Scheme.find(filter);
    return res.json(schemes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/schemes
router.post('/', async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    return res.status(201).json(scheme);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
