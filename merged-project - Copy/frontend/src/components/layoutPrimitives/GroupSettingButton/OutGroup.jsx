import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component hiển thị cửa sổ xác nhận rời nhóm
 * Hiển thị popup xác nhận khi người dùng muốn rời khỏi nhóm
 * 
 * @param {boolean} isOpen - Trạng thái hiển thị của cửa sổ
 * @param {function} onClose - Hàm được gọi khi đóng cửa sổ hoặc hủy rời nhóm
 * @param {function} onConfirm - Hàm được gọi khi người dùng xác nhận muốn rời nhóm
 * @param {string} groupId - ID của nhóm
 */
const OutGroup = ({ isOpen, onClose, onConfirm, groupId }) => {
  const navigate = useNavigate();
  
  // Nếu cửa sổ không được mở thì không hiển thị gì
  if (!isOpen) return null;

  // Xử lý khi click ra ngoài cửa sổ
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // Xử lý khi xác nhận rời nhóm
  const handleConfirm = () => {
    if (onConfirm) {
      // Gọi callback để xử lý hành động rời nhóm đã được định nghĩa trong GroupSetting
      onConfirm();
    } else {
      // Nếu không có callback, thực hiện hành động mặc định
      navigate('/groups');
    }
    // Đóng cửa sổ popup
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden p-6">
        <h2 className="text-lg font-semibold text-center mb-4">Xác nhận rời nhóm?</h2>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-purple-400 text-black rounded-full hover:bg-purple-500 transition-colors"
          >
            Đồng ý
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutGroup;