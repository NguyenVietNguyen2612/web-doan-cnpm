import api from './api';

const BASE_PATH = '/bookings';

const bookingService = {
  // Lấy danh sách đặt chỗ (chỉ dành cho admin)
  getAllBookings: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}`, {
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

  // Lấy thông tin đặt chỗ theo ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đặt chỗ:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin đặt chỗ'
      };
    }
  },

  // Tạo đặt chỗ mới
  createBooking: async (bookingData) => {
    try {
      const response = await api.post(`${BASE_PATH}`, bookingData);
      return {
        success: true,
        data: response.data,
        message: 'Đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi đặt chỗ:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi đặt chỗ'
      };
    }
  },

  // Cập nhật thông tin đặt chỗ
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}`, bookingData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật thông tin đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin đặt chỗ:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin đặt chỗ'
      };
    }
  },

  // Xóa đặt chỗ
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      return {
        success: true,
        message: 'Xóa đặt chỗ thành công'
      };
    } catch (error) {
      console.error('Lỗi khi xóa đặt chỗ:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi xóa đặt chỗ'
      };
    }
  },

  // Cập nhật trạng thái đặt chỗ
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/status`, { status });
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
  },

  // Lấy danh sách đặt chỗ của người dùng hiện tại
  getMyBookings: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/me`);
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
  }
};

export default bookingService; 