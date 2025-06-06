import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import TimeManager from '../../../../components/groupWidgets/TimeManager/TimeManager';
import { getGroupById } from '../../../../services/groupService';

const TimeEditor = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
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
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
        groupId={groupId}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <TimeManager userRole="leader" groupId={groupId} />
      </LeaderLayout>
    </div>
  );
};

export default TimeEditor;
