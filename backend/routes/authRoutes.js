const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'farmx_jwt_secret', {
    expiresIn: '30d'
  });
};

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && (authHeader.startsWith('Bearer') || authHeader.startsWith('Token'))) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farmx_jwt_secret');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized, invalid token' });
  }
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role, phone, village, district, first_name, last_name } = req.body;
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
      district: district || 'Mandya'
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      username: user.username,
      email: user.email,
      role: user.role,
      district: user.district,
      phone: user.phone
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
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
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        district: user.district,
        phone: user.phone
      });
    }

    return res.status(400).json({ error: 'Wrong Credentials' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  return res.json(req.user);
});

// @route POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.status(204).send();
});

module.exports = router;
