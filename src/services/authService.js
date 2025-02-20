import api from './api';
import { withRetry } from '../utils/network/retryHandler';

export const authService = {
  register: withRetry(async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  }),

  login: withRetry(async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  }),

  updateProfile: withRetry(async (userData) => {
    return await api.put('/users/profile', userData);
  }),

  getUserStats: withRetry(async () => {
    return await api.get('/users/stats');
  }),

  logout() {
    localStorage.removeItem('token');
  }
};