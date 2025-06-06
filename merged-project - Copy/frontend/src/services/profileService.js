import { API_CONFIG, getAuthHeaders } from '../constants/config.js';

/**
 * Service cho việc tương tác với API quản lý profile người dùng
 */

// Lấy thông tin cá nhân của người dùng
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Không thể lấy dữ liệu người dùng');
    }

    return { 
      success: result.success, 
      data: result.data 
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { 
      success: false, 
      message: error.message || 'Không thể kết nối đến server' 
    };
  }
};

// Cập nhật thông tin cá nhân của người dùng
export const updateUserProfile = async (userData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Không thể cập nhật dữ liệu người dùng');
    }

    return { 
      success: result.success, 
      message: result.message,
      data: userData // Trả về dữ liệu đã cập nhật
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { 
      success: false, 
      message: error.message || 'Không thể kết nối đến server' 
    };
  }
};

// Upload avatar (giữ nguyên để tương lai sử dụng)
export const uploadAvatar = async (file) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Trong môi trường thực tế, chúng ta sẽ tải file lên server
    // và nhận URL của hình ảnh trả về
    
    // Ở đây, chúng ta chỉ giả lập quá trình này bằng cách đọc file 
    // và chuyển đổi thành data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Tạm thời lưu vào localStorage (sẽ thay thế bằng API thật)
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.avatar = reader.result;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        resolve({ success: true, data: { avatarUrl: reader.result } });
      };
      reader.onerror = () => {
        reject({ success: false, message: 'Không thể tải ảnh lên' });
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, message: 'Không thể tải ảnh lên' };
  }
};
