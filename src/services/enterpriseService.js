import api from './api';

const BASE_PATH = '/enterprises';

const enterpriseService = {
  // Lấy danh sách doanh nghiệp
  getAllEnterprises: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách doanh nghiệp thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách doanh nghiệp:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách doanh nghiệp'
      };
    }
  },

  // Lấy thông tin doanh nghiệp theo ID
  getEnterpriseById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin doanh nghiệp thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin doanh nghiệp'
      };
    }
  },

  // Tạo doanh nghiệp mới
  createEnterprise: async (enterpriseData) => {
    try {
      const response = await api.post(`${BASE_PATH}`, enterpriseData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo doanh nghiệp thành công'
      };
    } catch (error) {
      console.error('Lỗi khi tạo doanh nghiệp:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi tạo doanh nghiệp'
      };
    }
  },

  // Cập nhật thông tin doanh nghiệp
  updateEnterprise: async (id, enterpriseData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}`, enterpriseData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật thông tin doanh nghiệp thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin doanh nghiệp:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin doanh nghiệp'
      };
    }
  },

  // Xóa doanh nghiệp
  deleteEnterprise: async (id) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      return {
        success: true,
        message: 'Xóa doanh nghiệp thành công'
      };
    } catch (error) {
      console.error('Lỗi khi xóa doanh nghiệp:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi xóa doanh nghiệp'
      };
    }
  },

  // Lấy danh sách bài đăng của doanh nghiệp
  getEnterprisePosts: async (id, page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}/posts`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách bài đăng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài đăng:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách bài đăng'
      };
    }
  },

  // Tạo bài đăng mới cho doanh nghiệp
  createPost: async (enterpriseId, postData) => {
    try {
      const response = await api.post(`${BASE_PATH}/${enterpriseId}/posts`, postData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo bài đăng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi tạo bài đăng'
      };
    }
  },

  // Lấy danh sách đặt chỗ của doanh nghiệp
  getEnterpriseBookings: async (id, page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}/bookings`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ'
      };
    }
  },

  // Cập nhật trạng thái đặt chỗ
  updateBookingStatus: async (enterpriseId, bookingId, status) => {
    try {
      const response = await api.put(`${BASE_PATH}/${enterpriseId}/bookings/${bookingId}`, { status });
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật trạng thái đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật trạng thái đặt chỗ'
      };
    }
  }
};

export default enterpriseService; 