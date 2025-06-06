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
  groupName = "Nhóm", 
  memberCount = 0, 
  onSettings, 
  onBack, 
  showBackToGroups = false,
  backTarget = '/groups',
  groupId: propGroupId,
  isLeader = false
}) => {
  const navigate = useNavigate();
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
  };

  const handleAddMember = () => {
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

  // Lấy chữ cái đầu tiên của tên nhóm để làm avatar
  const getGroupAvatar = (name) => {
    if (!name || name.trim() === '') return 'N';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-b">
      {/* Phần trái: Avatar và thông tin nhóm */}
      <div className="flex items-center">
        {/* Avatar nhóm */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mr-3 shadow-md">
          <span className="text-lg font-bold">
            {getGroupAvatar(groupName)}
          </span>
        </div>
        
        {/* Thông tin nhóm */}
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-800 text-lg leading-tight">
            {groupName}
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6.926 6.926 0 00-1.5-.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
            <span>{memberCount} thành viên</span>
          </div>
        </div>
      </div>

      {/* Phần phải: Các nút */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleSettingsClick}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors font-medium"
        >
          Cài đặt
        </button>
        <button 
          onClick={handleBackNavigation}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium"
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

      {/* Cửa sổ thêm thành viên */}
      <AddNewMember
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
    </div>
  );
};

export default GroupHeader;