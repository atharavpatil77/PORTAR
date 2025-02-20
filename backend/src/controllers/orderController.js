import Order from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { awardXP } from '../services/levelingService.js';
import emailService from '../services/emailService.js';
import notificationService from '../services/notificationService.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      pickupAddress,
      pickupContact,
      deliveryAddress,
      deliveryContact,
      packageType,
      weight,
      description,
      scheduledDate,
      priority,
      cost,
      estimatedDelivery
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      pickupAddress,
      pickupContact,
      deliveryAddress,
      deliveryContact,
      packageType,
      weight,
      description: description || '',
      scheduledDate,
      priority,
      cost,
      estimatedDelivery,
      status: 'in_transit',
      timeline: [{ status: 'in_transit', timestamp: new Date() }]
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    order.status = status;
    order.timeline.push({ status, timestamp: new Date() });

    await order.save();

    // Handle notifications and rewards asynchronously
    try {
      await Promise.all([
        status === 'delivered' && awardXP(order.user, 50).catch(console.error),
        status === 'delivered' && notificationService.notifyOrderStatusChange(order.user, order._id, status).catch(console.error),
        emailService.sendOrderStatusUpdate(req.user, order).catch(console.error)
      ].filter(Boolean));
    } catch (error) {
      // Log any errors but don't fail the request
      console.error('Non-critical services failed:', error);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 'pending'
    });

    if (!order) {
      throw new ApiError(404, 'Order not found or cannot be cancelled');
    }

    order.status = 'cancelled';
    order.timeline.push({ status: 'cancelled', timestamp: new Date() });
    await order.save();

    await notificationService.notifyOrderStatusChange(req.user.id, order._id, 'cancelled');

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Only allow users to delete their own orders
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this order');
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};