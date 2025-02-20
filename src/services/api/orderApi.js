import axiosInstance from '../../utils/http/axiosInstance';
import { API_ENDPOINTS } from '../../config/api.config';
import { withRetry } from '../../utils/network/retryHandler';

export const orderApi = {
  getOrders: withRetry(async () => {
    return await axiosInstance.get(API_ENDPOINTS.orders.list);
  }),

  createOrder: withRetry(async (orderData) => {
    return await axiosInstance.post(API_ENDPOINTS.orders.create, orderData);
  }),

  getOrderById: withRetry(async (id) => {
    return await axiosInstance.get(API_ENDPOINTS.orders.details(id));
  }),

  cancelOrder: withRetry(async (id) => {
    return await axiosInstance.post(API_ENDPOINTS.orders.cancel(id));
  }),

  getOrderStats: withRetry(async () => {
    return await axiosInstance.get(API_ENDPOINTS.orders.stats);
  })
};