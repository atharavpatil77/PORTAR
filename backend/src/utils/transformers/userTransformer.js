import { hashData } from '../security.js';

export const transformUserForStorage = (userData) => {
  return {
    fullName: userData.fullName.trim(),
    email: userData.email.toLowerCase().trim(),
    phone: userData.phone.replace(/\s+/g, ''),
    level: 1,
    xp: 0,
    achievements: []
  };
};

export const calculateUserStats = (user, orders) => {
  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    totalSpent: orders.reduce((sum, o) => sum + o.cost, 0),
    averageOrderCost: 0,
    memberSince: user.createdAt,
    lastActive: user.updatedAt
  };

  stats.averageOrderCost = stats.totalOrders ? 
    stats.totalSpent / stats.totalOrders : 0;

  return stats;
};

export const maskSensitiveData = (user) => {
  return {
    ...user,
    email: user.email.replace(/(?<=.{3}).(?=.*@)/g, '*'),
    phone: user.phone.replace(/(?<=.{4}).(?=.{4})/g, '*')
  };
};