import React, { useRef, useEffect, useState } from 'react';
import MemberInfor from '../../MemberInfor';
import Scrollbar from '../../../common/Scrollbar';

/**
 * Component hiển thị danh sách thành viên cho member
 */
const MemberListView = ({
  isOpen,
  onClose,
  anchorRef,
  members = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'Trưởng nhóm' },
    { id: 2, name: 'Nguyễn Văn B', email: 'nguyenvanb@gmail.com', role: 'Thành viên' },
    { id: 3, name: 'Nguyễn Văn C', email: 'nguyenvanc@gmail.com', role: 'Thành viên' },
    { id: 4, name: 'Nguyễn Văn D', email: 'nguyenvand@gmail.com', role: 'Thành viên' }
  ],
  className = ''
}) => {
  const popupRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Tính toán vị trí popup dựa vào vị trí của nút kích hoạt
  useEffect(() => {
    if (isOpen && anchorRef.current && popupRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popupEl = popupRef.current;

      // Đặt popup bên phải của nút
      popupEl.style.position = 'absolute';
      popupEl.style.top = `${anchorRect.top}px`;
      popupEl.style.left = `${anchorRect.right + 10}px`; // Cách 10px
      
      // Đảm bảo popup không vượt ra khỏi màn hình
      const rightEdge = anchorRect.right + 10 + popupEl.offsetWidth;
      if (rightEdge > window.innerWidth) {
        // Nếu vượt ra ngoài phía bên phải, đặt bên trái của nút
        popupEl.style.left = `${anchorRect.left - popupEl.offsetWidth - 10}px`;
      }
    }
  }, [isOpen, anchorRef]);

  // Xử lý khi click vào tên thành viên
  const handleMemberClick = (member, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const elementHeight = rect.height;
    setSelectedMember(member);
    setPopupPosition({
      x: rect.left - 290,
      y: rect.top - (elementHeight / 3)
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay để đóng popup khi click ngoài */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => {
          setSelectedMember(null);
          onClose();
        }}
      />

      {/* Popup content */}
      <div
        ref={popupRef}
        className={`w-72 bg-white rounded-lg shadow-xl z-50 ${className}`}
      >
        {/* Danh sách thành viên trong nhóm */}
        <div>
          <h3 className="px-4 py-3 text-sm font-semibold">Thành viên trong nhóm</h3>
          <Scrollbar height="300px" className="border-t border-gray-200">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={(e) => handleMemberClick(member, e)}
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  {member.name.charAt(0)}
                </div>
                <span>{member.name}</span>
              </div>
            ))}
          </Scrollbar>
        </div>
      </div>

      {/* Member Info Popup */}
      <MemberInfor 
        member={selectedMember}
        isVisible={selectedMember !== null}
        position={popupPosition}
      />
    </>
  );
};

export default MemberListView;
