import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Header cho trang quản lý sự kiện nhóm
 * Hiển thị tên nhóm, số thành viên và các nút chức năng
 * 
 * @param {string} groupName - Tên nhóm sẽ hiển thị
 * @param {number} memberCount - Số thành viên trong nhóm
 * @param {function} onSettings - Hàm được gọi khi nhấn nút Cài đặt
 * @param {function} onBack - Hàm được gọi khi nhấn nút Trở về (tùy chọn)
 * @param {boolean} showBackToGroups - Nếu true sẽ luôn trở về trang danh sách nhóm, nếu false sẽ sử dụng onBack
 * @param {string} backTarget - URL đích khi nhấn nút Trở về (mặc định là '/groups')
 */
const GroupHeader = ({ 
  groupName, 
  memberCount, 
  onSettings, 
  onBack, 
  showBackToGroups = false,
  backTarget = '/groups'
}) => {
  const navigate = useNavigate();

  // Xử lý nút trở về - ưu tiên quay lại danh sách nhóm nếu showBackToGroups=true
  const handleBackNavigation = () => {
    if (showBackToGroups) {
      navigate(backTarget);
    } else if (onBack) {
      onBack();
    } else {
      navigate(backTarget);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-b">
      {/* Phần trái: Thông tin nhóm */}
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center mr-3">
          {groupName.charAt(0)}
        </div>
        <div className="font-medium">{groupName} <span className="text-sm text-gray-600">{memberCount}ng</span></div>
      </div>
      
      {/* Phần phải: Các nút */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onSettings}
          className="px-4 py-1 bg-purple-300 rounded-md text-sm hover:bg-purple-400 transition-colors"
        >
          Cài đặt
        </button>
        <button 
          onClick={handleBackNavigation}
          className="px-4 py-1 bg-purple-300 rounded-md text-sm hover:bg-purple-400 transition-colors"
        >
          Trở về
        </button>
      </div>
    </div>  );
};

export default GroupHeader;