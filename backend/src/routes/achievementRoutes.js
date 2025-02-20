import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { achievementValidation } from '../validations/achievementValidation.js';
import {
  getAchievements,
  checkUserAchievements,
  createAchievement,
  updateAchievement
} from '../controllers/achievementController.js';

const router = Router();

router.use(protect);

router.get('/', getAchievements);
router.post('/check', checkUserAchievements);

// Admin routes
router.post(
  '/',
  admin,
  achievementValidation.createAchievement,
  validateRequest,
  createAchievement
);

router.put(
  '/:id',
  admin,
  achievementValidation.updateAchievement,
  validateRequest,
  updateAchievement
);

export default router;