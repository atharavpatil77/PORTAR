import { ORDER_TYPES } from '../constants.js';

export const validateBusinessHours = (date) => {
  const hours = date.getHours();
  const day = date.getDay();
  
  // Business hours: Monday-Friday, 9 AM - 6 PM
  const isWeekday = day >= 1 && day <= 5;
  const isBusinessHours = hours >= 9 && hours < 18;
  
  return isWeekday && isBusinessHours;
};

export const calculateDeliveryFee = (distance, weight, packageType) => {
  const baseRate = 10;
  const distanceRate = 0.5; // per km
  const weightRate = {
    [ORDER_TYPES.DOCUMENT]: 0.5,
    [ORDER_TYPES.PARCEL]: 1,
    [ORDER_TYPES.FRAGILE]: 2,
    [ORDER_TYPES.HEAVY]: 3
  };

  return baseRate + (distance * distanceRate) + (weight * weightRate[packageType]);
};

export const validateOrderCapacity = async (date, Order) => {
  const MAX_ORDERS_PER_DAY = 50;
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const orderCount = await Order.countDocuments({
    scheduledDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  return orderCount < MAX_ORDERS_PER_DAY;
};