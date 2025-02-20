import api from './api';

export const orderService = {
  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  },

  async getOrders() {
    return await api.get('/orders');
  },

  async getOrderById(id) {
    return await api.get(`/orders/${id}`);
  },

  async cancelOrder(id) {
    return await api.post(`/orders/${id}/cancel`);
  },

  async getOrderStats() {
    return await api.get('/orders/stats');
  }
};