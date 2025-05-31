/**
 * Service mô phỏng cho việc tương tác với API quản lý profile người dùng
 */

// Khởi tạo local storage với dữ liệu mẫu nếu chưa có
const initializeProfileData = () => {
  if (!localStorage.getItem('userData')) {
    localStorage.setItem('userData', JSON.stringify({
      name: "Nguyễn Văn A",
      phone: "012345678",
      email: "nguyenvana@gmail.com",
      avatar: null // Sẽ sử dụng ảnh mặc định nếu avatar là null
    }));
  }
};

// Lấy thông tin cá nhân của người dùng
export const getUserProfile = async () => {
  initializeProfileData();
  
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return { success: true, data: userData };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { success: false, message: 'Không thể lấy dữ liệu người dùng' };
  }
};

// Cập nhật thông tin cá nhân của người dùng
export const updateUserProfile = async (userData) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Lấy dữ liệu cũ để giữ các trường không thay đổi
    const oldData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Cập nhật với dữ liệu mới
    const updatedData = { ...oldData, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    return { success: true, data: updatedData };
  } catch (error) {
    console.error('Error updating user data:', error);
    return { success: false, message: 'Không thể cập nhật dữ liệu người dùng' };
  }
};

// Upload avatar
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
        // Cập nhật avatar trong localStorage
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
