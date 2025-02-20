import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { handleNetworkError } from '../network/errorHandler';
import { refreshTokenIfNeeded } from './tokenManager';

const axiosInstance = axios.create(API_CONFIG);

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    await refreshTokenIfNeeded();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the entire response object
    return response;
  },
  (error) => {
    if (!error.response) {
      return Promise.reject(handleNetworkError(error));
    }

    const errorResponse = {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      errors: error.response.data?.errors || []
    };

    // Only redirect to login if not already on login page and it's an auth error
    if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;