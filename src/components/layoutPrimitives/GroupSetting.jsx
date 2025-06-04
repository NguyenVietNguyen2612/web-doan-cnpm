import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APerson from '../../assets/images/APerson.png';
import MultiPeople from '../../assets/images/MultiPeople.png';
import OutGroupIcon from '../../assets/images/OutGroup.png';
import OutGroup from './GroupSettingButton/OutGroup';
import MemberListLeader from './GroupSettingButton/MemberList/MemberListLeader';
import MemberListView from './GroupSettingButton/MemberList/MemberListView';
import { leaveGroup } from '../../services/groupService';

/**
 * Component hiển thị cửa sổ cài đặt nhóm
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

  // Reset state showMemberList when settings popup is opened
  useEffect(() => {
    if (isOpen) {
      setShowMemberList(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle click outside the popup
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      if (showMemberList) {
        setShowMemberList(false);
      } else {
        onClose();
      }
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
    onClose();
  };

  // Xử lý khi nhấn vào tùy chọn xem danh sách thành viên
  const handleMemberList = () => {
    if (isLeader) {
      setShowMemberList(true);
    } else {
      setShowMemberList(true);
    }
  };

  // Xử lý khi nhấn vào tùy chọn rời nhóm
  const handleLeaveGroup = () => {
    setShowLeaveConfirmation(true);
  };

  const handleConfirmLeave = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await leaveGroup(groupId);
        if (response.success) {
          navigate('/groups');
        } else {
          console.error('Lỗi khi rời nhóm:', response.message);
          alert('Không thể rời nhóm. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Lỗi khi rời nhóm:', error);
        alert('Có lỗi xảy ra.');
      }
    }
    setShowLeaveConfirmation(false);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-end p-4 z-50"
        onClick={handleOutsideClick}
      >
        <div className="bg-gray-100 rounded-lg shadow-xl w-72 overflow-hidden z-50">
          {/* Phần trên: Ảnh đại diện và tên nhóm */}
          <div className="flex flex-col items-center p-4">
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

      {/* Danh sách thành viên */}
      {showMemberList && (
        isLeader ? (
          <MemberListLeader
            isOpen={true}
            onClose={() => setShowMemberList(false)}
            anchorRef={memberListButtonRef}
            className="absolute"
          />
        ) : (
          <MemberListView
            isOpen={true}
            onClose={() => setShowMemberList(false)}
            anchorRef={memberListButtonRef}
            className="absolute"
          />
        )
      )}
    </>
  );
};

export default GroupSetting;