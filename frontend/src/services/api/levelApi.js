import axiosInstance from '../../utils/http/axiosInstance';
import { API_ENDPOINTS } from '../../config/api.config';
import { withRetry } from '../../utils/network/retryHandler';

export const levelApi = {
  // Get all levels
  getLevels: withRetry(async () => {
    try {
      console.log('Fetching levels from:', API_ENDPOINTS.levels.list);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(API_ENDPOINTS.levels.list, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Levels response:', response);
      if (!response.data) {
        throw new Error('No data received from levels API');
      }
      return response.data;
    } catch (error) {
      console.error('Error in getLevels:', error.response || error);
      throw error.response?.data || error;
    }
  }),

  // Get level by ID
  getLevelById: withRetry(async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(API_ENDPOINTS.levels.details(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('No data received from level details API');
      }
      return response.data;
    } catch (error) {
      console.error('Error in getLevelById:', error.response || error);
      throw error.response?.data || error;
    }
  }),

  // Get user's current level
  getCurrentLevel: withRetry(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(API_ENDPOINTS.levels.current, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('No data received from current level API');
      }
      return response.data;
    } catch (error) {
      console.error('Error in getCurrentLevel:', error.response || error);
      throw error.response?.data || error;
    }
  }),

  // Get next level
  getNextLevel: withRetry(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(API_ENDPOINTS.levels.next, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new Error('No data received from next level API');
      }
      return response.data;
    } catch (error) {
      console.error('Error in getNextLevel:', error.response || error);
      throw error.response?.data || error;
    }
  })
};
