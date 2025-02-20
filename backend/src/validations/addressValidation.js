import { body } from 'express-validator';

export const addressValidation = {
  createAddress: [
    body('label')
      .trim()
      .notEmpty()
      .withMessage('Label is required')
      .isLength({ max: 50 })
      .withMessage('Label cannot exceed 50 characters'),
    
    body('street')
      .trim()
      .notEmpty()
      .withMessage('Street address is required')
      .isLength({ max: 100 })
      .withMessage('Street address cannot exceed 100 characters'),
    
    body('city')
      .trim()
      .notEmpty()
      .withMessage('City is required')
      .isLength({ max: 50 })
      .withMessage('City cannot exceed 50 characters'),
    
    body('state')
      .trim()
      .notEmpty()
      .withMessage('State is required')
      .isLength({ max: 50 })
      .withMessage('State cannot exceed 50 characters'),
    
    body('zipCode')
      .trim()
      .notEmpty()
      .withMessage('ZIP code is required')
      .matches(/^[A-Z0-9-]{3,10}$/)
      .withMessage('Invalid ZIP code format'),
    
    body('country')
      .trim()
      .notEmpty()
      .withMessage('Country is required')
      .isLength({ max: 50 })
      .withMessage('Country cannot exceed 50 characters'),
    
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean')
  ],

  updateAddress: [
    body('label')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Label cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Label cannot exceed 50 characters'),
    
    body('street')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Street address cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Street address cannot exceed 100 characters'),
    
    body('city')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('City cannot be empty')
      .isLength({ max: 50 })
      .withMessage('City cannot exceed 50 characters'),
    
    body('state')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('State cannot be empty')
      .isLength({ max: 50 })
      .withMessage('State cannot exceed 50 characters'),
    
    body('zipCode')
      .optional()
      .trim()
      .matches(/^[A-Z0-9-]{3,10}$/)
      .withMessage('Invalid ZIP code format'),
    
    body('country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Country cannot exceed 50 characters'),
    
    body('isDefault')
      .optional()
      .isBoolean()
      .withMessage('isDefault must be a boolean')
  ]
};