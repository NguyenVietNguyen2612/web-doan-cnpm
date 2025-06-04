import api from './api';

const BASE_PATH = '/events';

const eventService = {
  // Lấy danh sách sự kiện
  getAllEvents: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${BASE_PATH}`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách sự kiện thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách sự kiện'
      };
    }
  },

  // Lấy thông tin sự kiện theo ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin sự kiện thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sự kiện:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin sự kiện'
      };
    }
  },

  // Tạo sự kiện mới
  createEvent: async (eventData) => {
    try {
      const response = await api.post(`${BASE_PATH}`, eventData);
      return {
        success: true,
        data: response.data,
        message: 'Tạo sự kiện thành công'
      };
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi tạo sự kiện'
      };
    }
  },

  // Cập nhật thông tin sự kiện
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}`, eventData);
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật thông tin sự kiện thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sự kiện:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin sự kiện'
      };
    }
  },

  // Xóa sự kiện
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      return {
        success: true,
        message: 'Xóa sự kiện thành công'
      };
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi xóa sự kiện'
      };
    }
  },

  // Lấy danh sách đặt chỗ cho sự kiện
  getEventBookings: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}/bookings`);
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

  // Tạo đặt chỗ mới cho sự kiện
  createBooking: async (eventId, bookingData) => {
    try {
      const response = await api.post(`${BASE_PATH}/${eventId}/bookings`, bookingData);
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

  // Cập nhật trạng thái đặt chỗ
  updateBookingStatus: async (eventId, bookingId, status) => {
    try {
      const response = await api.put(`${BASE_PATH}/${eventId}/bookings/${bookingId}`, { status });
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

export default eventService; 