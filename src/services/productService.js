import api from './api';

export const productService = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }

    const query = params.toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },

  getProductById: async (id) => {
    return api.get(`/products?id=${id}`);
  },

  getCategories: async () => {
    return api.get('/products/categories');
  },
};