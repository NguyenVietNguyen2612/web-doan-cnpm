/**
 * Service mô phỏng cho việc quản lý thời gian rảnh rỗi của người dùng
 */

// Khởi tạo local storage với dữ liệu mẫu nếu chưa có
const initializeAvailableDays = () => {
  if (!localStorage.getItem('availableDays')) {
    // Mặc định đánh dấu một vài ngày trong tháng hiện tại
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    const defaultAvailableDays = [
      `${year}-${month}-14`,
      `${year}-${month}-15`,
      `${year}-${month}-21`
    ];
    
    localStorage.setItem('availableDays', JSON.stringify(defaultAvailableDays));
  }
};

// Lấy danh sách ngày rảnh rỗi
export const getAvailableDays = async () => {
  initializeAvailableDays();
  
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const availableDays = JSON.parse(localStorage.getItem('availableDays')) || [];
    return { success: true, data: availableDays };
  } catch (error) {
    console.error('Error fetching available days:', error);
    return { success: false, message: 'Không thể lấy dữ liệu ngày rảnh rỗi' };
  }
};

// Cập nhật danh sách ngày rảnh rỗi
export const updateAvailableDays = async (availableDays) => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    localStorage.setItem('availableDays', JSON.stringify(availableDays));
    return { success: true, data: availableDays };
  } catch (error) {
    console.error('Error updating available days:', error);
    return { success: false, message: 'Không thể cập nhật dữ liệu ngày rảnh rỗi' };
  }
};
