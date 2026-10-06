import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },

  getUserOrders: async () => {
    return api.get('/orders');
  },

  getOrderById: async (id) => {
    return api.get(`/orders?id=${id}`);
  },

  getOrderByNumber: async (orderNumber) => {
    return api.get(`/orders?order_number=${orderNumber}`);
  },
};