import apiClient from './apiClient';

export const authService = {
  login: async (email, password) => {
    return await apiClient.post('/auth/login', { email, password });
  },
  register: async (fullName, email, password) => {
    return await apiClient.post('/auth/register', { fullName, email, password });
  },
  getMe: async () => {
    return await apiClient.get('/auth/me');
  }
};
