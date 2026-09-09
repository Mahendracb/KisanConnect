const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect middleware: Verifies JWT token and attaches user to req.user.
 * Rejects with 401 if missing, invalid, or expired.
 */
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('Token '))) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no authentication token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farmx_jwt_secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(`[Auth Middleware Error]: ${err.message}`);
    return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
  }
};

/**
 * Optional protect middleware:
 * If token is provided and valid, attaches req.user.
 * If no token is provided, continues without blocking.
 */
const optionalProtect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('Token '))) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farmx_jwt_secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignored for optional protection
      req.user = null;
    }
  }

  next();
};

/**
 * Role-based authorization middleware
 * Usage: authorize('farmer', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized, please login first' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorize
};
