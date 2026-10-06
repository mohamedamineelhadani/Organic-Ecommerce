import api from './api';

export const cartService = {
  getCart: async () => {
    return api.get('/cart');
  },

  addToCart: async (productId, quantity = 1) => {
    return api.post('/cart', {
      product_id: productId,
      quantity,
    });
  },

  updateCartItem: async (productId, quantity) => {
    return api.put('/cart', {
      product_id: productId,
      quantity,
    });
  },

  removeFromCart: async (productId) => {
    return api.delete(`/cart?product_id=${productId}`);
  },

  clearCart: async () => {
    return api.delete('/cart');
  },
};