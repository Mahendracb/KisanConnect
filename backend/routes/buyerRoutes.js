const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');

// @route GET /api/buyers
router.get('/', async (req, res) => {
  try {
    const { crop, location } = req.query;
    let filter = {};

    if (crop && crop !== 'All Crops') {
      filter.crop_interest = { $regex: crop, $options: 'i' };
    }
    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { company: { $regex: location, $options: 'i' } }
      ];
    }

    const buyers = await Buyer.find(filter).sort({ rating: -1 });
    return res.json(buyers);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/buyers
router.post('/', async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    return res.status(201).json(buyer);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
