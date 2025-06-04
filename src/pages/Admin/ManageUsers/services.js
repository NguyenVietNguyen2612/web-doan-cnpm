import api from '../../../services/api';

// Service để thêm người dùng mới (dành cho admin)
export const addUsers = async (emails, defaultPassword) => {
  try {
    const users = emails.map(email => {
      // Tạo username từ phần đầu của email
      const username = email.split('@')[0];
      
      return {
        username,
        email,
        password: defaultPassword,
        full_name: username, // Tên mặc định lấy từ username
        role: 'Member',
        status: 'pending' // Trạng thái mặc định là 'pending' khi admin tạo
      };
    });
    
    const response = await api.post('/users/batch', { users });
    
    return {
      success: true,
      data: response.data,
      message: `Đã thêm thành công ${emails.length} người dùng`
    };
  } catch (error) {
    console.error('Lỗi khi thêm người dùng:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể thêm người dùng'
    };
  }
};

// Service để lấy danh sách người dùng
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể lấy danh sách người dùng'
    };
  }
};

// Service để xóa người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return {
      success: true,
      message: 'Xóa người dùng thành công'
    };
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể xóa người dùng'
    };
  }
};
