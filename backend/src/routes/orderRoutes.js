import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { orderValidation } from '../validations/orderValidation.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  cancelOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = Router();

router.use(protect);

router.route('/')
  .post(orderValidation.createOrder, validateRequest, createOrder)
  .get(getOrders);

router.get('/stats', getOrderStats);

router.route('/:id')
  .get(getOrderById)
  .put(admin, orderValidation.updateStatus, validateRequest, updateOrderStatus)
  .delete(deleteOrder);

router.post('/:id/cancel', cancelOrder);

export default router;