import { ORDER_TYPES } from '../constants.js';
import { calculateOrderCost } from '../orderUtils.js';
import { calculateDeliveryWindow } from '../dateUtils.js';

export const transformOrderForStorage = (orderData) => {
  const cost = calculateOrderCost(orderData.packageType, orderData.weight);
  const estimatedDelivery = calculateDeliveryWindow(
    orderData.scheduledDate,
    orderData.packageType
  );

  return {
    pickupAddress: orderData.pickupAddress,
    deliveryAddress: orderData.deliveryAddress,
    packageType: orderData.packageType,
    weight: Number(orderData.weight),
    description: orderData.description?.trim(),
    scheduledDate: new Date(orderData.scheduledDate),
    estimatedDelivery,
    cost,
    status: 'pending',
    timeline: [{ status: 'pending', timestamp: new Date() }]
  };
};

export const calculateOrderMetrics = (orders) => {
  return orders.reduce((metrics, order) => {
    metrics.totalOrders++;
    metrics.totalCost += order.cost;
    
    if (order.status === 'delivered') {
      metrics.completedOrders++;
      const deliveryTime = new Date(order.timeline.slice(-1)[0].timestamp) - 
                          new Date(order.timeline[0].timestamp);
      metrics.totalDeliveryTime += deliveryTime;
    }
    
    return metrics;
  }, {
    totalOrders: 0,
    completedOrders: 0,
    totalCost: 0,
    totalDeliveryTime: 0
  });
};