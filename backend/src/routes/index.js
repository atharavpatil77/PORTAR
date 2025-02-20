import { Router } from 'express';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import addressRoutes from './addressRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import driverRoutes from './driverRoutes.js';
import levelRoutes from './levelRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);
router.use('/achievements', achievementRoutes);
router.use('/drivers', driverRoutes);
router.use('/levels', levelRoutes);

export default router;