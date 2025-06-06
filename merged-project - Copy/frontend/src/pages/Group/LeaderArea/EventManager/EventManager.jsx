import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import Event from '../../../../components/groupWidgets/EventManager/Event';
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
  
  // State cho thông tin sự kiện
  const [eventInfo, setEventInfo] = useState({
    name: 'Đang tải...',
    memberCount: 0,
    eventDetails: {
      name: '',
      location: '',
      time: '',
      locationType: '',
      matchRate: '0%',
      bookingStatus: 'Chưa đặt',
      notificationStatus: 'Chưa thông báo',
      attendeeCount: 0
    }
  });
  
  // State để theo dõi loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho thông báo đặt chỗ thành công
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  
  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Fetching group data for groupId:', groupId);
        
        const response = await getGroupById(groupId);
        console.log('📦 Group response:', response);
        
        if (response.success) {
          // Merge với default eventDetails nếu không có
          const mergedEventInfo = {
            ...response.data,
            eventDetails: {
              name: '',
              location: '',
              time: '',
              locationType: '',
              matchRate: '0%',
              bookingStatus: 'Chưa đặt',
              notificationStatus: 'Chưa thông báo',
              attendeeCount: 0,
              ...(response.data.eventDetails || {})
            }
          };
          
          // Kiểm tra xem có thông tin đặt chỗ được lưu không
          const bookingData = localStorage.getItem('bookingConfirmed');
          
          if (bookingData) {
            const booking = JSON.parse(bookingData);
            
            // Kiểm tra xem đặt chỗ có phải cho nhóm này không và còn mới không (trong vòng 5 phút)
            const isRecent = (new Date() - new Date(booking.timestamp)) < 5 * 60 * 1000; // 5 phút
            
            if (booking.groupId === groupId && isRecent) {
              // Cập nhật trạng thái đặt chỗ
              mergedEventInfo.eventDetails = {
                ...mergedEventInfo.eventDetails,
                bookingStatus: 'Đã xác nhận',
                attendeeCount: booking.attendeeCount,
                bookerName: booking.bookerName
              };
              
              // Hiển thị thông báo đặt chỗ thành công
              setShowBookingSuccess(true);
              
              // Ẩn thông báo sau 5 giây
              setTimeout(() => {
                setShowBookingSuccess(false);
                localStorage.removeItem('bookingConfirmed');
              }, 5000);
            }
          }
          
          setEventInfo(mergedEventInfo);
          console.log('✅ Event info set:', mergedEventInfo);
        } else {
          console.error('❌ Lỗi khi lấy thông tin nhóm:', response.message);
          // Không alert, chỉ log để debug
        }
      } catch (error) {
        console.error('💥 Lỗi khi lấy thông tin nhóm:', error);
        // Không alert, chỉ log để debug
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);
  const handleViewBookingDetails = () => {
    alert('Chi tiết sự kiện sẽ được hiển thị tại đây');
  };
  
  const handleNotifyEvent = () => {
    alert('Đã gửi thông báo sự kiện đến tất cả thành viên!');
  };
  
  const handleBookingContact = () => {
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
    navigate(`/groups/${groupId}/event-update`);
  };
  
  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: handleViewBookingDetails },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}      <GroupHeader 
        groupName={eventInfo.name || 'Đang tải...'}
        memberCount={eventInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
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

        {/* Các nút hành động */}
        <div className="grid grid-cols-3 gap-4 p-4">
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

        {/* Event Component */}
        {isLoading ? (
          <div className="mt-4 bg-white rounded-md shadow-sm p-8 text-center">
            <div className="text-gray-500">Đang tải thông tin sự kiện...</div>
          </div>
        ) : (
          <Event
            variant="leader"
            eventDetails={eventInfo.eventDetails || {}}
            className="mt-4"
          />
        )}
      </LeaderLayout>
    </div>
  );
};

export default EventManager;
