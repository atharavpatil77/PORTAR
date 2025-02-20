import { Router } from 'express';
import { getLevels, getLevelById, getUserLevel, getNextLevel } from '../controllers/levelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All routes are protected and require authentication
router.use(protect);

// Level routes
router.get('/', getLevels);
router.get('/:id', getLevelById);
router.get('/user/current', getUserLevel);
router.get('/user/next', getNextLevel);

export default router;
