export const calculateOrderCost = (packageType, weight) => {
  const baseCosts = {
    document: 10,
    parcel: 15,
    fragile: 25,
    heavy: 35
  };

  const weightMultiplier = {
    document: 0.5,
    parcel: 1,
    fragile: 1.5,
    heavy: 2
  };

  const baseCost = baseCosts[packageType];
  const multiplier = weightMultiplier[packageType];
  
  return baseCost + (weight * multiplier);
};

export const validateOrderData = (orderData) => {
  const errors = [];

  if (!orderData.pickupAddress) {
    errors.push('Pickup address is required');
  }

  if (!orderData.deliveryAddress) {
    errors.push('Delivery address is required');
  }

  if (!['document', 'parcel', 'fragile', 'heavy'].includes(orderData.packageType)) {
    errors.push('Invalid package type');
  }

  if (!orderData.weight || orderData.weight <= 0) {
    errors.push('Weight must be greater than 0');
  }

  return errors;
};