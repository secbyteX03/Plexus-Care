const { StatusCodes } = require('http-status-codes');

/**
 * Middleware to validate request data against schema
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Middleware to validate object ID format
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }
  next();
};

/**
 * Middleware to validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Page must be a positive number'
    });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Limit must be between 1 and 100'
    });
  }
  
  // Add pagination to request object
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
  
  next();
};

module.exports = {
  validateRequest,
  validateObjectId,
  validatePagination
};
