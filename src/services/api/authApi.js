import axiosInstance from '../../utils/http/axiosInstance';
import { API_ENDPOINTS } from '../../config/api.config';
import { withRetry } from '../../utils/network/retryHandler';

export const authApi = {
  login: withRetry(async (credentials) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.auth.login, credentials);
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (!data.user) {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error.response || error);
      throw new Error(error.message || 'Invalid email or password');
    }
  }),

  register: withRetry(async (userData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.auth.register, userData);
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      if (!data.user) {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error.response || error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }),

  updateProfile: withRetry(async (userData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.auth.profile, userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response || error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }),

  getUserStats: withRetry(async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.auth.stats);
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error.response || error);
      throw new Error(error.message || 'Failed to fetch user stats');
    }
  })
};