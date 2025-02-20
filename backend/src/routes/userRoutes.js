import { Router } from 'express';
import { register, login, updateProfile, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import * as userValidation from '../middleware/validationMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', userValidation.register, validateRequest, register);
router.post('/login', userValidation.login, validateRequest, login);
router.put('/profile', protect, userValidation.updateProfile, validateRequest, updateProfile);
router.put('/role', protect, updateUserRole);

export default router;