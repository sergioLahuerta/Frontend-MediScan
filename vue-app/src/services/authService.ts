import apiClient from './axios';

export default {
  async login(credentials: any) {
    try {
      const response = await apiClient.post('/Auth/Login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Network error or server down' };
    }
  },

  async register(userData: any) {
    try {
      const response = await apiClient.post('/Auth/Register', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }
};
