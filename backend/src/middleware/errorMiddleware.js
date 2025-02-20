import { ApiError } from '../utils/apiError.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: 'Duplicate field value',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    errors: err.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};