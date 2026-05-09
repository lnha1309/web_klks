import apiClient from './apiClient';

export const checkService = {
  predictAndSave: async (text) => {
    return await apiClient.post('/checks', { text });
  },
  getHistory: async () => {
    return await apiClient.get('/checks/history');
  },
  deleteCheck: async (id) => {
    return await apiClient.delete(`/checks/${id}`);
  }
};
