const Crop = require('../models/Crop');
const { syncMandiPrices } = require('../services/mandiCron');

// @desc    Get all crops with optional search & location filters
// @route   GET /api/crops
// @access  Public
const getCrops = async (req, res) => {
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
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json(crop);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Sync Mandi prices from agricultural data feed
// @route   POST /api/crops/sync
// @access  Private (Protected)
const syncCrops = async (req, res) => {
  try {
    const result = await syncMandiPrices();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new crop entry
// @route   POST /api/crops
// @access  Private (Protected)
const createCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    return res.status(201).json(crop);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// @desc    Update crop details
// @route   PUT /api/crops/:id
// @access  Private (Protected)
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json(crop);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// @desc    Delete crop entry
// @route   DELETE /api/crops/:id
// @access  Private (Protected)
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    return res.json({ message: 'Crop deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  syncCrops,
  createCrop,
  updateCrop,
  deleteCrop
};
