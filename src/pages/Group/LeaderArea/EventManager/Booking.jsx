import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlinePhone, HiOutlineClipboardList, HiOutlineCheckCircle } from 'react-icons/hi';

// Custom styles for animations
const styles = {
  '@keyframes bounceIn': {
    '0%': { transform: 'scale(0.8)', opacity: 0 },
    '70%': { transform: 'scale(1.05)', opacity: 1 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  '@keyframes progress': {
    '0%': { width: '0%' },
    '100%': { width: '100%' },
  },
};

// Inject CSS animation styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      70% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes progress {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    
    .animate-bounce-in {
      animation: bounceIn 0.5s ease-out forwards;
    }
    
    .animate-progress {
      animation: progress 2s linear forwards;
    }
  `;
  document.head.appendChild(styleSheet);
}

const Booking = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  // State để lưu thông tin nhóm và đặt chỗ
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
    eventDetails: {
      name: '',
      location: '',
      time: '',
    }
  });
    // State cho form đặt chỗ
  const [bookingInfo, setBookingInfo] = useState({
    bookerName: 'Nguyễn Văn A',  // Mặc định người đặt
    attendeeCount: 5,             // Mặc định số người tham gia
    bookingTime: 'Từ 8h - 15h',   // Mặc định thời gian đặt
    phoneNumber: '0123456789',    // Mặc định số điện thoại
    notes: ''                     // Ghi chú, mặc định rỗng
  });
  
  // State cho validation
  const [errors, setErrors] = useState({
    bookerName: '',
    attendeeCount: '',
    bookingTime: '',
    phoneNumber: '',
  });
    // State cho trạng thái loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho trạng thái thành công
  const [showSuccess, setShowSuccess] = useState(false);

  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo(response.data);
        } else {
          console.error('Lỗi khi lấy thông tin nhóm:', response.message);
          alert('Không thể lấy thông tin nhóm. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin nhóm:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu.');
      }
    };

    fetchGroupData();
  }, [groupId]);
  // Xử lý validation cho form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!bookingInfo.bookerName.trim()) {
      newErrors.bookerName = 'Vui lòng nhập tên người đặt';
      isValid = false;
    }
    
    if (bookingInfo.attendeeCount <= 0) {
      newErrors.attendeeCount = 'Số người tham gia phải lớn hơn 0';
      isValid = false;
    }
    
    if (!bookingInfo.bookingTime.trim()) {
      newErrors.bookingTime = 'Vui lòng nhập thời gian đặt';
      isValid = false;
    }
    
    // Kiểm tra định dạng số điện thoại VN
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(bookingInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Xử lý khi thay đổi các trường trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo({
      ...bookingInfo,
      [name]: value
    });
    
    // Clear error message khi người dùng typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  // Xử lý khi nhấn nút xác nhận đặt
  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return; // Dừng lại nếu form không hợp lệ
    }
    
    try {
      setIsSubmitting(true);
      
      // Trong thực tế sẽ gọi API để gửi thông tin đặt chỗ
      // await confirmBooking(groupId, bookingInfo);
      
      // Giả lập kết nối API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Hiển thị thông báo thành công
      setShowSuccess(true);
        // Cập nhật trạng thái đặt chỗ trong localStorage để EventManager có thể đọc
      localStorage.setItem('bookingConfirmed', JSON.stringify({
        groupId,
        timestamp: new Date().toISOString(),
        bookerName: bookingInfo.bookerName,
        attendeeCount: bookingInfo.attendeeCount
      }));
      
      // Tự động chuyển trang sau 2 giây
      setTimeout(() => {
        navigate(`/groups/${groupId}/event-manager`);
      }, 2000);
      
    } catch (error) {
      console.error('Lỗi khi xác nhận đặt chỗ:', error);
      alert('Có lỗi xảy ra khi xác nhận đặt chỗ. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };
  // Xử lý khi nhấn nút trở về
  const handleBack = () => {
    // Hiển thị xác nhận nếu người dùng đã nhập dữ liệu
    const hasChanges = 
      bookingInfo.bookerName !== 'Nguyễn Văn A' || 
      bookingInfo.attendeeCount !== 5 ||
      bookingInfo.bookingTime !== 'Từ 8h - 15h' ||
      bookingInfo.phoneNumber !== '0123456789' ||
      bookingInfo.notes !== '';
    
    if (hasChanges && !showSuccess) {
      if (window.confirm('Bạn có thông tin chưa lưu. Bạn có chắc chắn muốn quay lại không?')) {
        navigate(`/groups/${groupId}/event-manager`);
      }
    } else {
      navigate(`/groups/${groupId}/event-manager`);
    }
  };

  // Xử lý các hành động điều hướng  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
        onBack={handleBack}
      />
      
      {/* Main Content */}      <LeaderLayout rightButtons={rightButtons}>
        {/* Success notification */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full animate-bounce-in">
              <div className="flex items-center justify-center text-green-500 mb-4">
                <HiOutlineCheckCircle className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Đặt chỗ thành công!</h3>
              <p className="text-gray-600 text-center mb-6">
                Thông tin đặt chỗ đã được gửi đến nơi kinh doanh. Bạn sẽ được chuyển hướng trong vài giây.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div className="bg-green-500 h-1.5 rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white p-4 rounded-md shadow-sm">{/* Tiêu đề và nút hành động */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Thông tin đặt chỗ</h2>
            <div className="flex space-x-4">
              <button 
                onClick={handleBack}
                className="flex items-center justify-center bg-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 transition-all text-gray-700 font-medium"
              >
                Huỷ
              </button>              <button 
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className={`flex items-center justify-center bg-purple-500 py-2 px-6 rounded-md hover:bg-purple-600 transition-all text-white font-medium ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : 'Xác nhận đặt chỗ'}
              </button>
            </div>
          </div>
            {/* Form thông tin đặt chỗ */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HiOutlineUserGroup className="mr-2 text-purple-600" />
                <label className="text-gray-700 font-medium">Người đặt</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="bookerName"
                  value={bookingInfo.bookerName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                    errors.bookerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên người đặt chỗ"
                />
                {errors.bookerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bookerName}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HiOutlineUserGroup className="mr-2 text-purple-600" />
                <label className="text-gray-700 font-medium">Số lượng người tham gia</label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="attendeeCount"
                  value={bookingInfo.attendeeCount}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                    errors.attendeeCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số lượng người tham gia"
                />
                {errors.attendeeCount && (
                  <p className="text-red-500 text-sm mt-1">{errors.attendeeCount}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HiOutlineCalendar className="mr-2 text-purple-600" />
                <label className="text-gray-700 font-medium">Thời gian đặt</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="bookingTime"
                  value={bookingInfo.bookingTime}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                    errors.bookingTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập thời gian đặt chỗ (vd: 8h-15h)"
                />
                {errors.bookingTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.bookingTime}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HiOutlinePhone className="mr-2 text-purple-600" />
                <label className="text-gray-700 font-medium">Số điện thoại</label>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={bookingInfo.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập số điện thoại liên hệ"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <HiOutlineClipboardList className="mr-2 text-purple-600" />
                <label className="text-gray-700 font-medium">Ghi chú</label>
              </div>
              <div className="relative">
                <textarea
                  name="notes"
                  value={bookingInfo.notes}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none resize-none"
                  rows="4"
                  placeholder="Thêm các ghi chú đặc biệt hoặc yêu cầu (nếu có)"
                />
              </div>
            </div>            {/* Chính sách đặt chỗ */}
            <div className="bg-blue-50 p-4 mt-6 mb-6 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  <strong>Chính sách đặt chỗ:</strong> Việc đặt chỗ sẽ gửi thông tin trực tiếp đến địa điểm kinh doanh. 
                  Bạn có thể cần thanh toán đặt cọc để xác nhận việc đặt chỗ. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                </p>
              </div>
            </div>
            
            {/* Thông tin tóm tắt sự kiện */}
            <div className="bg-purple-50 p-4 mt-6 rounded-lg border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-3">Thông tin sự kiện</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <HiOutlineLocationMarker className="text-purple-600 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Địa điểm</span>
                    <span className="font-medium">{groupInfo.eventDetails?.location || 'Chưa có thông tin'}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <HiOutlineCalendar className="text-purple-600 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Thời gian sự kiện</span>
                    <span className="font-medium">{groupInfo.eventDetails?.time || 'Chưa có thông tin'}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <HiOutlineUserGroup className="text-purple-600 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Loại địa điểm</span>
                    <span className="font-medium">{groupInfo.eventDetails?.locationType || 'Chưa có thông tin'}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <HiOutlineClipboardList className="text-purple-600 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-500 text-sm block">Trạng thái</span>
                    <span className="font-medium">{groupInfo.eventDetails?.bookingStatus || 'Chưa đặt'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default Booking;
