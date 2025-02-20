export const formatUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  level: user.level,
  xp: user.xp,
  achievements: user.achievements
});

export const formatOrderResponse = (order) => ({
  id: order._id,
  status: order.status,
  packageType: order.packageType,
  weight: order.weight,
  cost: order.cost,
  pickupAddress: order.pickupAddress,
  deliveryAddress: order.deliveryAddress,
  scheduledDate: order.scheduledDate,
  estimatedDelivery: order.estimatedDelivery,
  timeline: order.timeline,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt
});

export const formatAddressResponse = (address) => ({
  id: address._id,
  label: address.label,
  street: address.street,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country,
  isDefault: address.isDefault
});

export const formatErrorResponse = (error) => ({
  status: 'error',
  message: error.message,
  errors: error.errors || [],
  stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
});