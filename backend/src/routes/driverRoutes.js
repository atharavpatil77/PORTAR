import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  updateStatus,
  updateLocation,
  getNearbyDrivers,
  deleteDriver
} from '../controllers/driverController.js';

const router = express.Router();

// Public routes
router.get('/nearby', getNearbyDrivers);

// Protected routes
router.use(protect);
router.route('/')
  .get(getAllDrivers)
  .post(createDriver);

router.route('/:id')
  .get(getDriver)
  .put(updateDriver)
  .delete(deleteDriver);

router.put('/:id/status', updateStatus);
router.put('/:id/location', updateLocation);

export default router;
