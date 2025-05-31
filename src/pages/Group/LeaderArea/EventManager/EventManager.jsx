import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';
import { HiOutlineCheckCircle } from 'react-icons/hi';

// Inject CSS animation styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `;
  document.head.appendChild(styleSheet);
}

const EventManager = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
    // State để lưu thông tin nhóm
  const [eventInfo, setEventInfo] = useState({
    name: '',
    memberCount: 0,
    eventDetails: {
      name: '',
      location: '',
      time: '',
      locationType: '',
      matchRate: '',
      bookingStatus: '',
      notificationStatus: '',
      attendeeCount: 0
    }
  });
  
  // State cho thông báo đặt chỗ thành công
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          // Kiểm tra xem có thông tin đặt chỗ được lưu không
          const bookingData = localStorage.getItem('bookingConfirmed');
          
          if (bookingData) {
            const booking = JSON.parse(bookingData);
            
            // Kiểm tra xem đặt chỗ có phải cho nhóm này không và còn mới không (trong vòng 5 phút)
            const isRecent = (new Date() - new Date(booking.timestamp)) < 5 * 60 * 1000; // 5 phút
            
            if (booking.groupId === groupId && isRecent) {
              // Cập nhật trạng thái đặt chỗ
              const updatedEventInfo = {
                ...response.data,
                eventDetails: {
                  ...response.data.eventDetails,
                  bookingStatus: 'Đã xác nhận',
                  attendeeCount: booking.attendeeCount,
                  bookerName: booking.bookerName
                }
              };
              
              setEventInfo(updatedEventInfo);
                // Hiển thị thông báo đặt chỗ thành công
              setShowBookingSuccess(true);
              
              // Ẩn thông báo sau 5 giây
              setTimeout(() => {
                setShowBookingSuccess(false);
              }, 5000);
              
              // Xóa thông tin đặt chỗ từ localStorage sau khi đã sử dụng
              localStorage.removeItem('bookingConfirmed');
              return;
            }
          }
          
          setEventInfo(response.data);
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
    // Các hàm xử lý sự kiện
  const handleSettings = () => {
    console.log('Mở cài đặt nhóm');
    alert('Tính năng cài đặt nhóm đang được phát triển');
  };
  // Chỉ để tham chiếu, không cần sử dụng trong component mới
  const handleBack = () => {
    navigate('/groups');
  };

  const handleEditTime = () => {
    console.log('Chỉnh sửa thời gian');
    navigate(`/groups/${groupId}/time-editor`);
  };

  const handleEditLocation = () => {
    console.log('Chỉnh sửa vị trí và số thích');
    navigate(`/groups/${groupId}/location-preference`);
  };

  const handleViewGroupCalendar = () => {
    console.log('Xem lịch rảnh chung của cả nhóm');
    navigate(`/groups/${groupId}/group-calendar`);
  };

  const handleViewSuggestions = () => {
    console.log('Xem danh sách các đề xuất');
    navigate(`/groups/${groupId}/suggestion-list`);
  };

  const handleViewEvent = () => {
    console.log('Xem sự kiện');
    alert('Chi tiết sự kiện sẽ được hiển thị tại đây');
  };
  
  const handleNotifyEvent = () => {
    alert('Đã gửi thông báo sự kiện đến tất cả thành viên!');
  };    const handleBookingContact = () => {
    // Kiểm tra xem đã đặt chỗ chưa
    if (eventInfo.eventDetails?.bookingStatus === 'Đã xác nhận') {
      if (window.confirm('Bạn đã đặt chỗ cho sự kiện này. Bạn có muốn đặt lại không?')) {
        navigate(`/groups/${groupId}/booking`);
      }
    } else {
      navigate(`/groups/${groupId}/booking`);
    }
  };
  
  const handleEditEvent = () => {
    alert('Tính năng chỉnh sửa sự kiện đang được phát triển');
    // Trong tương lai có thể thêm navigate đến trang chỉnh sửa sự kiện
    // navigate(`/groups/${groupId}/edit-event`);
  };

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: handleEditTime },
    { label: 'Chỉnh sửa vị trí và số thích', onClick: handleEditLocation },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: handleViewGroupCalendar },
    { label: 'Xem danh sách các đề xuất', onClick: handleViewSuggestions },
    { label: 'Xem sự kiện', onClick: handleViewEvent },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}      <GroupHeader 
        groupName={eventInfo.name || 'Đang tải...'}
        memberCount={eventInfo.memberCount || 0}
        onSettings={handleSettings}
        showBackToGroups={true}
      />
        {/* Main Content */}      <LeaderLayout rightButtons={rightButtons}>
        {/* Notification đặt chỗ thành công */}
        {showBookingSuccess && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 font-medium">
                  Đặt chỗ thành công! Thông tin đã được gửi đến nơi kinh doanh.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          {/* Các nút hành động */}          <div className="grid grid-cols-3 gap-4 p-4">
            <button 
              className="bg-purple-300 text-center py-2 px-4 rounded-md hover:bg-purple-400 transition-colors text-sm font-medium"
              onClick={handleEditEvent}
            >
              Chỉnh sửa sự kiện
            </button>
            <button 
              className="bg-purple-300 text-center py-2 px-4 rounded-md hover:bg-purple-400 transition-colors text-sm font-medium"
              onClick={handleNotifyEvent}
            >
              Thông báo sự kiện
            </button>
            <button 
              className="bg-purple-300 text-center py-2 px-4 rounded-md hover:bg-purple-400 transition-colors text-sm font-medium"
              onClick={handleBookingContact}
            >
              Liên hệ đặt chỗ
            </button>
          </div>

          {/* Thông tin sự kiện - Bảng hiển thị */}
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Tên</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.name}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Địa điểm</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.location}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Thời gian</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.time}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Loại địa điểm</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.locationType}</td>
              </tr>              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Tỉ lệ khớp sở thích</td>
                <td className="py-3 px-4 flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: eventInfo.eventDetails.matchRate }}
                    ></div>
                  </div>
                  {eventInfo.eventDetails.matchRate}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Xác nhận đặt chỗ</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.bookingStatus}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Trạng thái thông báo</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.notificationStatus}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 bg-purple-100 font-medium">Số lượng người</td>
                <td className="py-3 px-4">{eventInfo.eventDetails.attendeeCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default EventManager;
