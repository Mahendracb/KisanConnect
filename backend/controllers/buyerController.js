const Buyer = require('../models/Buyer');

// @desc    Get all registered verified buyers with filters
// @route   GET /api/buyers
// @access  Public
const getBuyers = async (req, res) => {
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
};

// @desc    Register a new verified buyer
// @route   POST /api/buyers
// @access  Private (Protected)
const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    return res.status(201).json(buyer);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// @desc    Delete buyer
// @route   DELETE /api/buyers/:id
// @access  Private (Protected)
const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndDelete(req.params.id);
    if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
    return res.json({ message: 'Buyer deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBuyers,
  createBuyer,
  deleteBuyer
};
