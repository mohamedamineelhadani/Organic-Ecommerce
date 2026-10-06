import api from './api';

export const contactService = {
  send: async (data) => {
    return api.post('/contact', data);
  },

  getAll: async () => {
    return api.get('/contact');
  },
};