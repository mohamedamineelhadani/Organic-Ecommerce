import api from './api';

function decodeToken(token) {
  try {
    const [payloadPart] = token.split('.');
    if (!payloadPart) return null;

    // base64 → json
    const json = atob(payloadPart);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      full_name: userData.full_name || userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
    });


    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Profile
  getProfile: async () => {
    return api.get('/auth/profile');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Is token valid?
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = decodeToken(token);
    if (!payload || !payload.exp) return false;

    // exp is in seconds
    return payload.exp * 1000 > Date.now();
  },

  // Get stored user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Get raw token
  getToken: () => localStorage.getItem('token'),
};