import api from './api';

/**
 * Service để xử lý các API calls liên quan đến events
 */

// Lấy tất cả events
export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách sự kiện'
    };
  }
};

// Lấy event theo ID
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sự kiện:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin sự kiện'
    };
  }
};

// Lấy events của một nhóm
export const getEventsByGroupId = async (groupId) => {
  try {
    const response = await api.get(`/events/group/${groupId}`);
    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện của nhóm:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách sự kiện của nhóm'
    };
  }
};

// Tạo event mới
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo sự kiện'
    };
  }
};

// Cập nhật event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật sự kiện:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sự kiện'
    };
  }
};

// Xóa event
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi xóa sự kiện:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa sự kiện'
    };
  }
}; 