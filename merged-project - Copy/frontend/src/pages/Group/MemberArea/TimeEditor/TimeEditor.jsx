import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import MemberLayout from '../../../../components/layoutPrimitives/MemberLayout';
import TimeManager from '../../../../components/groupWidgets/TimeManager/TimeManager';
import { getGroupById } from '../../../../services/groupService';

/**
 * Component cho phép thành viên cập nhật thời gian rảnh
 */
const TimeEditor = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  // State để lưu thông tin nhóm
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });

  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo({
            name: response.data.group_name,
            memberCount: response.data.member_count,
          });
          console.log('✅ Group info loaded:', response.data);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin nhóm:', error);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => {} },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/member/location-preference`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/member/event-viewer`) },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={false}
        groupId={groupId}
      />
      
      {/* Main Content */}
      <MemberLayout rightButtons={rightButtons}>
        <TimeManager userRole="member" groupId={groupId} />
      </MemberLayout>
    </div>
  );
};

export default TimeEditor;
