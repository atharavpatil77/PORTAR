export const ORDER_TYPES = {
  DOCUMENT: 'document',
  PARCEL: 'parcel',
  FRAGILE: 'fragile',
  HEAVY: 'heavy'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ACHIEVEMENT_TYPES = {
  LEVEL_REACHED: 'LEVEL_REACHED',
  ORDERS_COMPLETED: 'ORDERS_COMPLETED',
  XP_EARNED: 'XP_EARNED'
};

export const CACHE_KEYS = {
  USER_ADDRESSES: 'user-addresses',
  USER_ORDERS: 'user-orders',
  USER_STATS: 'user-stats'
};

export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600     // 1 hour
};