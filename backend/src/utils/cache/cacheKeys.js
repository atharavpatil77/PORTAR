export const generateCacheKey = (...parts) => {
  return parts.filter(Boolean).join(':');
};

export const generateUserCacheKey = (userId, resource) => {
  return generateCacheKey('user', userId, resource);
};

export const generateOrderCacheKey = (orderId) => {
  return generateCacheKey('order', orderId);
};

export const generateListCacheKey = (resource, filters = {}) => {
  const filterString = Object.entries(filters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
    
  return generateCacheKey(resource, 'list', filterString);
};