const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: 'error',
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

/**
 * Generate JWT token
 */
const generateToken = (userId, email, role = 'user', expiresIn = '30d') => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = {
  authenticate,
  authorize,
  generateToken
};
