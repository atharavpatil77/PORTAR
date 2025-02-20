import { body } from 'express-validator';

export const achievementValidation = {
  createAchievement: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('xpReward').isInt({ min: 1 }).withMessage('XP reward must be positive'),
    body('type')
      .isIn(['LEVEL_REACHED', 'ORDERS_COMPLETED', 'XP_EARNED'])
      .withMessage('Invalid achievement type'),
    body('criteria').isObject().withMessage('Criteria must be an object'),
    body('icon').trim().notEmpty().withMessage('Icon is required')
  ],

  updateAchievement: [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('xpReward').optional().isInt({ min: 1 }).withMessage('XP reward must be positive'),
    body('type')
      .optional()
      .isIn(['LEVEL_REACHED', 'ORDERS_COMPLETED', 'XP_EARNED'])
      .withMessage('Invalid achievement type'),
    body('criteria').optional().isObject().withMessage('Criteria must be an object'),
    body('icon').optional().trim().notEmpty().withMessage('Icon cannot be empty')
  ]
};