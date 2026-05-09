import apiClient from './apiClient';

export const feedbackService = {
  createFeedback: async (checkId, actualLabel, comment) => {
    return await apiClient.post('/feedbacks', { checkId, actualLabel, comment });
  }
};
