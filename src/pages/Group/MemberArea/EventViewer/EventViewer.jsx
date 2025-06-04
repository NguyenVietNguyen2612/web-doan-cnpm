import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import MemberLayout from '../../../../components/layoutPrimitives/MemberLayout';
import Event from '../../../../components/groupWidgets/EventManager/Event';
import { Dialog } from '../../../../components/common/Dialog';
import { getGroupById, confirmEventParticipation } from '../../../../services/groupService';

/**
 * Component hiển thị thông tin sự kiện dành cho thành viên nhóm
 * Cho phép thành viên xem thông tin sự kiện đã được tạo
 */
const EventViewer = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
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

  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
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
  const handleEditTime = () => {
    navigate(`/groups/${groupId}/member/time-editor`);
  };

  const handleEditLocation = () => {
    navigate(`/groups/${groupId}/member/location-preference`);
  };

  const handleConfirmParticipation = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      const response = await confirmEventParticipation(groupId);
      if (response.success) {
        // Refresh group data to get updated attendee count
        const groupResponse = await getGroupById(groupId);
        if (groupResponse.success) {
          setEventInfo(groupResponse.data);
        }
        setShowConfirmDialog(false);
      } else {
        alert('Không thể xác nhận tham gia: ' + response.message);
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận tham gia:', error);
      alert('Có lỗi xảy ra khi xác nhận tham gia.');
    } finally {
      setConfirmLoading(false);
    }
  };
  
  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: handleEditTime },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: handleEditLocation },
    { label: 'Xem sự kiện', onClick: () => {} }, // Không cần hành động vì đang ở trang xem sự kiện
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <GroupHeader 
        groupName={eventInfo.name || 'Đang tải...'}
        memberCount={eventInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={false}
        groupId={groupId}
      />
      
      {/* Main Content */}
      <MemberLayout rightButtons={rightButtons}>
        <Event
          variant="member"
          eventDetails={eventInfo.eventDetails}
          onConfirmParticipation={handleConfirmParticipation}
        />
        <Dialog
          isOpen={showConfirmDialog}
          onClose={() => !confirmLoading && setShowConfirmDialog(false)}
          onConfirm={handleConfirm}
          title="Xác nhận tham gia"
          message="Bạn có chắc chắn muốn tham gia sự kiện này?"
          confirmText={confirmLoading ? "Đang xác nhận..." : "Xác nhận"}
          type="confirm"
        />
      </MemberLayout>
    </div>
  );
};

export default EventViewer;
