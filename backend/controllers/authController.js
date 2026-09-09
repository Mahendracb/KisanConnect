const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'farmx_jwt_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password, email, role, phone, village, district, first_name, last_name, landSizeAcres, primaryCrop } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const userExists = await User.findOne({ username: username.trim() });
    if (userExists) {
      return res.status(400).json({ error: 'Account already exists. Please login.' });
    }

    const user = await User.create({
      username: username.trim(),
      password,
      email: email || (username.includes('@') ? username : ''),
      first_name: first_name || '',
      last_name: last_name || '',
      role: role || 'farmer',
      phone: phone || '',
      village: village || '',
      district: district || 'Mandya',
      landSizeAcres: landSizeAcres || 2,
      primaryCrop: primaryCrop || 'Sugarcane'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      _id: user._id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      district: user.district,
      village: user.village,
      phone: user.phone,
      landSizeAcres: user.landSizeAcres,
      primaryCrop: user.primaryCrop
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const identifier = username.trim();
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
    });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      return res.json({
        token,
        _id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        district: user.district,
        village: user.village,
        phone: user.phone,
        landSizeAcres: user.landSizeAcres,
        primaryCrop: user.primaryCrop
      });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Protected)
const getMe = async (req, res) => {
  return res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Protected)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { first_name, last_name, email, phone, village, district, landSizeAcres, primaryCrop } = req.body;

    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (village !== undefined) user.village = village;
    if (district !== undefined) user.district = district;
    if (landSizeAcres !== undefined) user.landSizeAcres = landSizeAcres;
    if (primaryCrop !== undefined) user.primaryCrop = primaryCrop;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      role: updatedUser.role,
      district: updatedUser.district,
      village: updatedUser.village,
      phone: updatedUser.phone,
      landSizeAcres: updatedUser.landSizeAcres,
      primaryCrop: updatedUser.primaryCrop
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser
};
