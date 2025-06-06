import api from './api';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', {
        username: credentials.username, // Backend expects username field
        password: credentials.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      console.log('🚀 API call to /users/register with:', userData);
      const response = await api.post('/users/register', userData);
      console.log('✅ API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      throw new Error(errorMessage);
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã đăng nhập
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  }
};
