export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const API_ENDPOINTS = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    profile: '/users/profile',
    stats: '/users/stats'
  },
  orders: {
    list: '/orders',
    create: '/orders',
    details: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
    stats: '/orders/stats'
  },
  addresses: {
    list: '/addresses',
    create: '/addresses',
    update: (id) => `/addresses/${id}`,
    delete: (id) => `/addresses/${id}`,
    setDefault: (id) => `/addresses/${id}/default`
  },
  levels: {
    list: '/levels',
    details: (id) => `/levels/${id}`,
    current: '/levels/user/current',
    next: '/levels/user/next'
  },
  admin: {
    driversWithOrders: '/admin/drivers/orders',
    updateOrderStatus: '/admin/orders/status',
  }
};