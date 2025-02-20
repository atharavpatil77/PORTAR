import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { addressValidation } from '../validations/addressValidation.js';
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';

const router = Router();

router.use(protect);

router.route('/')
  .post(addressValidation.createAddress, validateRequest, createAddress)
  .get(getAddresses);

router.route('/:id')
  .put(addressValidation.updateAddress, validateRequest, updateAddress)
  .delete(deleteAddress);

router.put('/:id/default', setDefaultAddress);

export default router;