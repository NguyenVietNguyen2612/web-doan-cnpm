import api from './api';

const BASE_PATH = '/users';

const authService = {
  // Đăng ký người dùng mới
  register: async (userData) => {
    try {
      const response = await api.post(`${BASE_PATH}/register`, userData);
      return {
        success: true,
        data: response.data,
        message: 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký'
      };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post(`${BASE_PATH}/login`, credentials);
      
      // Lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
      };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  },

  // Kiểm tra người dùng đã đăng nhập chưa
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      return null;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${userId}`, userData);
      
      // Cập nhật thông tin người dùng trong localStorage nếu là người dùng hiện tại
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.user_id === userId) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...userData
        }));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật thông tin thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin'
      };
    }
  }
};

export default authService;
