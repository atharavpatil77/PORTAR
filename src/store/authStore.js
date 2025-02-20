import { create } from 'zustand';
import { authApi } from '../services/api/authApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const useAuthStore = create((set, get) => ({
  ...initialState,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      
      if (!response.user || !response.user.role) {
        throw new Error('Invalid response from server');
      }

      const userData = {
        ...response.user,
        role: response.user.role.toUpperCase() // Ensure role is uppercase
      };

      set({
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      return response;
    } catch (error) {
      console.error('Login store error:', error);
      set({ 
        ...initialState,
        error: error.message || 'Login failed'
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      
      if (!response.user || !response.user.role) {
        throw new Error('Invalid response from server');
      }

      const user = {
        ...response.user,
        role: response.user.role.toUpperCase() // Ensure role is uppercase
      };

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      return response;
    } catch (error) {
      console.error('Registration store error:', error);
      set({ 
        ...initialState,
        error: error.message || 'Registration failed'
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set(initialState);
  },

  updateUser: async (userData) => {
    try {
      const response = await authApi.updateProfile(userData);
      const updatedUser = {
        ...get().user,
        ...response.user,
        role: response.user.role.toUpperCase()
      };
      set({ user: updatedUser });
      return response;
    } catch (error) {
      console.error('Update user store error:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // Helper methods for role checking
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'ADMIN';
  },

  isDriver: () => {
    const { user } = get();
    return user?.role === 'DRIVER';
  },

  isUser: () => {
    const { user } = get();
    return user?.role === 'USER';
  }
}));

export default useAuthStore;