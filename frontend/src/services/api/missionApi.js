import { io } from 'socket.io-client';
import { API_ENDPOINTS } from '../../config/api.config';

let socket = null;
const subscribers = new Set();

export const subscribeToMissions = (callback) => {
  subscribers.add(callback);

  // Initialize socket if not already done
  if (!socket) {
    socket = io(API_ENDPOINTS.baseURL, {
      path: '/socket.io',
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Listen for mission updates
    socket.on('missionUpdate', (mission) => {
      subscribers.forEach(subscriber => subscriber(mission));
    });

    // Handle reconnection
    socket.on('connect', () => {
      console.log('Connected to mission updates');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from mission updates');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && socket) {
      socket.disconnect();
      socket = null;
    }
  };
};

export const unsubscribeFromMissions = (callback) => {
  subscribers.delete(callback);
  if (subscribers.size === 0 && socket) {
    socket.disconnect();
    socket = null;
  }
};
