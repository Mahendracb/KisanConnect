const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { syncMandiPrices } = require('../services/mandiCron');

// @route GET /api/crops
router.get('/', async (req, res) => {
  try {
    const { search, location } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const crops = await Crop.find(filter).sort({ name: 1 });
    return res.json(crops);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/crops/sync
router.post('/sync', async (req, res) => {
  try {
    const result = await syncMandiPrices();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route GET /api/crops/:id
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json(crop);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/crops
router.post('/', async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    return res.status(201).json(crop);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// @route PUT /api/crops/:id
router.put('/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json(crop);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// @route DELETE /api/crops/:id
router.delete('/:id', async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json({ message: 'Crop deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
