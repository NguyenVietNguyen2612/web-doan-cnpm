import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component hiển thị cửa sổ thêm thành viên mới
 * Cho phép tạo và sao chép link mời thành viên hoặc gửi lời mời qua email
 * 
 * @param {boolean} isOpen - Trạng thái hiển thị của cửa sổ
 * @param {function} onClose - Hàm được gọi khi đóng cửa sổ
 * @param {string} groupId - ID của nhóm
 */
const AddNewMember = ({ isOpen, onClose, groupId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  // Tạo link dựa trên groupId
  const inviteLink = `WEBmode-id-76-1506-t7Ubiqcc9MEQDeep-D`;
  
  // Nếu cửa sổ không được mở thì không hiển thị gì
  if (!isOpen) return null;

  // Xử lý khi click ra ngoài cửa sổ
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Xử lý khi copy link vào clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Đã sao chép link vào clipboard!');
    }, (err) => {
      console.error('Không thể sao chép: ', err);
    });
  };

  // Xử lý khi gửi lời mời qua email
  const handleSendInvite = () => {
    if (!email || !email.includes('@')) {
      alert('Vui lòng nhập một địa chỉ email hợp lệ!');
      return;
    }
    // Gửi lời mời (phần này sẽ cần kết nối với API thực tế)    
    console.log(`Gửi lời mời đến ${email}`);
    alert(`Đã gửi lời mời đến: ${email}`);
    setEmail('');
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100]"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-[500px] overflow-hidden p-6">
        <h2 className="text-lg font-semibold mb-4">Thêm thành viên</h2>
        
        {/* Phần tạo link mời */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link nhóm
          </label>
          <div className="flex">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-200 text-gray-600"
              value={inviteLink}
              readOnly
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Phần gửi lời mời qua email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhập email người bạn muốn mời
          </label>
          <div className="flex">
            <input
              type="email"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
            <button
              onClick={handleSendInvite}
              className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Nút đóng */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-400 text-black rounded-full hover:bg-purple-500 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMember;