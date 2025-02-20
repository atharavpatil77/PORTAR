import { body } from 'express-validator';
import { isValidEmail, isValidPhone, isValidPassword } from '../utils/validation.js';

export const userValidation = {
  register: [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom(isValidEmail)
      .withMessage('Invalid email format'),
    
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .custom(isValidPhone)
      .withMessage('Invalid phone number format'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom(isValidPassword)
      .withMessage('Password must be at least 8 characters long')
  ],

  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .custom(isValidEmail)
      .withMessage('Invalid email format'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateProfile: [
    body('fullName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Full name cannot be empty')
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters'),
    
    body('email')
      .optional()
      .trim()
      .custom(isValidEmail)
      .withMessage('Invalid email format'),
    
    body('phone')
      .optional()
      .trim()
      .custom(isValidPhone)
      .withMessage('Invalid phone number format'),
    
    body('currentPassword')
      .optional()
      .notEmpty()
      .withMessage('Current password is required when updating password'),
    
    body('newPassword')
      .optional()
      .custom(isValidPassword)
      .withMessage('New password must be at least 8 characters long')
  ]
};