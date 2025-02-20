import { API_CONFIG } from '../../config/api.config';
import useAuthStore from '../../store/authStore';

let refreshPromise = null;
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const refreshTokenIfNeeded = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // Refresh if token expires in less than 5 minutes
    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      if (!refreshPromise) {
        refreshPromise = refreshToken();
      }
      await refreshPromise;
      refreshPromise = null;
    }
  } catch (error) {
    console.error('Error checking token expiration:', error);
    // Don't logout immediately on token check error
  }
};

const refreshToken = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include' // Important for cookies
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      
      // Update user data if provided
      if (data.user) {
        useAuthStore.getState().updateUser(data.user);
      }
      
      return data;
    }
    
    throw new Error('No token in refresh response');
  } catch (error) {
    console.error('Token refresh error:', error);
    // Only logout if it's an authentication error
    if (error.message === 'Token refresh failed' || error.message === 'No token in refresh response') {
      localStorage.removeItem('token');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    throw error;
  }
};