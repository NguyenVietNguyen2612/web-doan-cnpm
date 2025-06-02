import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import APerson from '../../assets/images/APerson.png';
import MultiPeople from '../../assets/images/MultiPeople.png';
import OutGroupIcon from '../../assets/images/OutGroup.png';
import OutGroup from './GroupSettingButton/OutGroup';
import MemberListLeader from './GroupSettingButton/MemberList/MemberListLeader';
import { leaveGroup } from '../../services/groupService';

/**
 * Component hiển thị cửa sổ cài đặt nhóm
 * Cho phép thành viên chỉnh sửa thông tin nhóm, quản lý thành viên, hoặc rời nhóm
 * 
 * @param {boolean} isOpen - Trạng thái hiển thị của cửa sổ
 * @param {function} onClose - Hàm được gọi khi đóng cửa sổ
 * @param {string} groupName - Tên của nhóm
 * @param {string} groupId - ID của nhóm
 * @param {boolean} isLeader - Xác định người dùng hiện tại có phải là trưởng nhóm hay không
 * @param {function} onEditInfo - Hàm được gọi khi nhấn nút chỉnh sửa thông tin
 * @param {function} onAddMember - Hàm được gọi khi chọn tùy chọn thêm thành viên
 * @param {function} onMemberList - Hàm được gọi khi chọn tùy chọn xem danh sách thành viên
 * @param {function} onLeaveGroup - Hàm được gọi khi chọn tùy chọn rời nhóm
 */
const GroupSetting = ({ 
  isOpen, 
  onClose, 
  groupName = "Nhóm 1", 
  groupId, 
  isLeader = false,
  onEditInfo,
  onAddMember,
  onMemberList,
  onLeaveGroup
}) => {
  const navigate = useNavigate();
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const memberListButtonRef = useRef(null);

  // Nếu cửa sổ không được mở thì không hiển thị gì
  if (!isOpen) return null;

  // Xử lý khi click ra ngoài cửa sổ
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // Xử lý khi nhấn vào nút chỉnh sửa thông tin
  const handleEditInfo = () => {
    if (onEditInfo) {
      onEditInfo();
    } else {
      // Nếu không có hàm callback, điều hướng đến trang chỉnh sửa thông tin nhóm
      const path = isLeader 
        ? `/groups/${groupId}/edit` 
        : `/groups/${groupId}/member/info`;
      navigate(path);
    }
    onClose();
  };

  // Xử lý khi nhấn vào tùy chọn thêm thành viên
  const handleAddMember = () => {
    if (onAddMember) {
      onAddMember();
    }
    // Đóng cửa sổ GroupSetting
    onClose();
  };

  // Xử lý khi nhấn vào tùy chọn xem danh sách thành viên
  const handleMemberList = () => {
    if (isLeader) {
      // Nếu là trưởng nhóm, hiển thị popup danh sách thành viên
      setShowMemberList(true);
    } else if (onMemberList) {
      onMemberList();
    } else {
      navigate(`/groups/${groupId}/members`);
      onClose();
    }
  };

  // Xử lý khi nhấn vào tùy chọn rời nhóm
  const handleLeaveGroup = () => {
    if (onLeaveGroup) {
      // Nếu có hàm callback được truyền vào, gọi nó
      onLeaveGroup();
    } else {
      // Nếu không có, hiển thị popup xác nhận rời nhóm
      setShowLeaveConfirmation(true);
    }
    // Đóng panel cài đặt sau khi người dùng nhấn vào Rời nhóm
    onClose();
  };

  // Xử lý khi xác nhận rời nhóm - chỉ sử dụng khi không có callback onLeaveGroup
  const handleConfirmLeave = async () => {
    try {
      // Gọi API rời nhóm
      const response = await leaveGroup(groupId);
      
      if (response.success) {
        // Chuyển hướng về trang danh sách nhóm
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
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-end z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-gray-200 rounded-lg shadow-lg w-72 overflow-hidden mt-14 mr-4">
          {/* Phần trên: Avatar và tên nhóm */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-2">
            {groupName.charAt(0)}
          </div>
          <h3 className="text-center font-medium">{groupName}</h3>
          
          {/* Nút chỉnh sửa thông tin */}
          <button 
            className="mt-3 bg-purple-400 text-black py-2 px-6 rounded-full hover:bg-purple-500 transition-colors"
            onClick={handleEditInfo}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
        
        {/* Phần dưới: Menu tùy chọn */}
        <div className="bg-white p-4 rounded-lg">
          <ul className="space-y-4">
            {/* Tùy chọn thêm thành viên */}
            <li>
              <button 
                className="w-full flex items-center py-2 hover:bg-gray-50 transition-colors"
                onClick={handleAddMember}
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <img src={APerson} alt="Add member" className="w-6 h-6" />
                </div>
                <span className="ml-2">Thêm thành viên</span>
              </button>
            </li>
            
            {/* Tùy chọn xem danh sách thành viên */}
            <li>
              <button
                ref={memberListButtonRef}
                className="w-full flex items-center py-2 hover:bg-gray-50 transition-colors"
                onClick={handleMemberList}  
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <img src={MultiPeople} alt="Member list" className="w-6 h-6" />
                </div>
                <span className="ml-2">Danh sách thành viên</span>
              </button>
            </li>
            
            {/* Tùy chọn rời nhóm */}
            <li>
              <button
                className="w-full flex items-center py-2 hover:bg-gray-50 transition-colors"
                onClick={handleLeaveGroup}
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <img src={OutGroupIcon} alt="Leave group" className="w-6 h-6" />
                </div>
                <span className="ml-2">Rời Nhóm</span>              
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

      {/* OutGroup component for leave confirmation */}
      <OutGroup 
        isOpen={showLeaveConfirmation}
        onClose={() => setShowLeaveConfirmation(false)}
        onConfirm={handleConfirmLeave}
        groupId={groupId}
      />

      {/* MemberListLeader component for displaying member list (only for leader) */}
      {isLeader && (
        <MemberListLeader 
          isOpen={showMemberList}
          onClose={() => setShowMemberList(false)}
          anchorRef={memberListButtonRef}
          className="absolute"
        />
      )}
    </>
  );
};

export default GroupSetting;