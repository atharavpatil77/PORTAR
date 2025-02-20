import { ORDER_TYPES } from '../constants.js';

export const validatePackageType = (type) => {
  return Object.values(ORDER_TYPES).includes(type);
};

export const validateWeight = (weight, type) => {
  const maxWeights = {
    [ORDER_TYPES.DOCUMENT]: 1,
    [ORDER_TYPES.PARCEL]: 20,
    [ORDER_TYPES.FRAGILE]: 10,
    [ORDER_TYPES.HEAVY]: 100
  };

  return weight > 0 && weight <= maxWeights[type];
};

export const validateScheduledDate = (date) => {
  const scheduledDate = new Date(date);
  const now = new Date();
  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 30);

  return scheduledDate > now && scheduledDate <= maxFutureDate;
};

export const validateDeliveryWindow = (pickupDate, deliveryDate, packageType) => {
  const minDeliveryDays = {
    [ORDER_TYPES.DOCUMENT]: 1,
    [ORDER_TYPES.PARCEL]: 2,
    [ORDER_TYPES.FRAGILE]: 3,
    [ORDER_TYPES.HEAVY]: 4
  };

  const diffTime = Math.abs(deliveryDate - pickupDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= minDeliveryDays[packageType];
};