import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupSetting from './GroupSetting';
import AddNewMember from './GroupSettingButton/AddNewMember';
import OutGroup from './GroupSettingButton/OutGroup';

/**
 * Header cho trang quản lý sự kiện nhóm
 * Hiển thị tên nhóm, số thành viên và các nút chức năng
 * Tích hợp sẵn cửa sổ cài đặt nhóm khi nhấn vào nút Cài đặt
 * 
 * @param {string} groupName - Tên nhóm sẽ hiển thị
 * @param {number} memberCount - Số thành viên trong nhóm
 * @param {function} onSettings - Hàm được gọi khi nhấn nút Cài đặt (tùy chọn)
 * @param {function} onBack - Hàm được gọi khi nhấn nút Trở về (tùy chọn)
 * @param {boolean} showBackToGroups - Nếu true sẽ luôn trở về trang danh sách nhóm, nếu false sẽ sử dụng onBack
 * @param {string} backTarget - URL đích khi nhấn nút Trở về (mặc định là '/groups')
 * @param {string} groupId - ID của nhóm (được lấy từ URL params nếu không cung cấp)
 * @param {boolean} isLeader - Xác định người dùng hiện tại có phải là trưởng nhóm hay không
 */
const GroupHeader = ({ 
  groupName, 
  memberCount, 
  onSettings, 
  onBack, 
  showBackToGroups = false,
  backTarget = '/groups',
  groupId: propGroupId,
  isLeader = false
}) => {  const navigate = useNavigate();
  const params = useParams();
  
  // Lấy groupId từ URL params nếu không được truyền vào
  const groupId = propGroupId || params.groupId;
    // State để quản lý hiển thị cửa sổ cài đặt
  const [showSettings, setShowSettings] = useState(false);
  // State để quản lý hiển thị cửa sổ thêm thành viên
  const [showAddMember, setShowAddMember] = useState(false);
  // State để quản lý hiển thị cửa sổ xác nhận rời nhóm
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
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
    // Xử lý khi nhấn nút cài đặt
  const handleSettingsClick = () => {
    // Nếu có callback onSettings thì gọi nó và không mở cửa sổ cài đặt
    if (onSettings) {
      onSettings();
    } else {
      // Nếu không có callback, hiển thị cửa sổ cài đặt mặc định
      setShowSettings(true);
    }
  };
  
  // Xử lý khi đóng cửa sổ cài đặt
  const handleCloseSettings = () => {
    setShowSettings(false);
  };
  
  // Xử lý các hành động từ cửa sổ cài đặt
  const handleEditInfo = () => {
    const path = isLeader 
      ? `/groups/${groupId}/edit` 
      : `/groups/${groupId}/member/edit-info`;
    navigate(path);
  };  const handleAddMember = () => {
    // Hiển thị cửa sổ thêm thành viên và đóng cửa sổ cài đặt
    setShowAddMember(true);
    setShowSettings(false);
  };
  
  const handleMemberList = () => {
    navigate(`/groups/${groupId}/members`);
  };
  const handleLeaveGroup = () => {
    // Hiển thị cửa sổ xác nhận rời nhóm tùy chỉnh thay vì window.confirm
    setShowLeaveConfirmation(true);
  };
  
  // Xử lý khi người dùng xác nhận rời nhóm
  const handleConfirmLeaveGroup = async () => {
    try {
      // Import và sử dụng leaveGroup function từ groupService
      const { leaveGroup } = await import('../../services/groupService');
      const response = await leaveGroup(groupId);
      
      if (response.success) {
        navigate('/groups');
      } else {
        console.error("Lỗi khi rời nhóm:", response.message);
        alert("Không thể rời nhóm: " + response.message);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý rời nhóm:", error);
      navigate('/groups');
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
          onClick={handleSettingsClick}
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
        {/* Cửa sổ cài đặt nhóm */}
      <GroupSetting
        isOpen={showSettings}
        onClose={handleCloseSettings}
        groupName={groupName}
        groupId={groupId}
        isLeader={isLeader}
        onEditInfo={handleEditInfo}
        onAddMember={handleAddMember}
        onMemberList={handleMemberList}
        onLeaveGroup={handleLeaveGroup}
      />

      {/* Cửa sổ thêm thành viên */}      <AddNewMember
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        groupId={groupId}
      />

      {/* Cửa sổ xác nhận rời nhóm */}
      <OutGroup
        isOpen={showLeaveConfirmation}
        onClose={() => setShowLeaveConfirmation(false)}
        onConfirm={handleConfirmLeaveGroup}
        groupId={groupId}
      />
    </div>  );
};

export default GroupHeader;