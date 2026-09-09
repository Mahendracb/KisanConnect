const Scheme = require('../models/Scheme');

// @desc    Get agricultural government schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;

    const schemes = await Scheme.find(filter);
    return res.json(schemes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Add a new government scheme
// @route   POST /api/schemes
// @access  Private (Protected)
const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    return res.status(201).json(scheme);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// @desc    Delete scheme
// @route   DELETE /api/schemes/:id
// @access  Private (Protected)
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    return res.json({ message: 'Scheme deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSchemes,
  createScheme,
  deleteScheme
};
