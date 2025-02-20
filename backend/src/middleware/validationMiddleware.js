import { body, validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export const validateRequest = (req, res, next) => {
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.error('Validation errors:', JSON.stringify(errors.array(), null, 2));
      const errorMessages = errors.array().map(error => error.msg);
      throw new ApiError(400, 'Validation Error', errorMessages);
    }
    
    next();
  } catch (error) {
    console.error('Validation middleware error:', error);
    next(error);
  }
};

export const register = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Please provide a valid phone number')
];

export const login = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

export const updateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  body('currentPassword')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Current password is required when updating password'),
  
  body('newPassword')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Please provide a valid phone number')
];