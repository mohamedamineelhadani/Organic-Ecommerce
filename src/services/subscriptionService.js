import api from './api';

export const subscriptionService = {
  subscribe: async (email) => {
    return api.post('/subscriptions', { email });
  },

  getAll: async () => {
    return api.get('/subscriptions');
  },
};