import React, { useRef, useEffect } from 'react';

/**
 * Hiển thị danh sách thành viên và yêu cầu vào nhóm cho trưởng nhóm
 * @param {Object} props - Props của component
 * @param {boolean} props.isOpen - Trạng thái hiển thị popup
 * @param {Function} props.onClose - Hàm xử lý khi đóng popup
 * @param {Element} props.anchorRef - Tham chiếu đến element kích hoạt popup
 * @param {Array} props.members - Danh sách thành viên trong nhóm
 * @param {Array} props.requests - Danh sách yêu cầu vào nhóm
 * @param {string} props.className - Lớp CSS tùy chọn
 */
const MemberListLeader = ({
  isOpen,
  onClose,
  anchorRef,
  members = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Nguyễn Văn B' },
    { id: 3, name: 'Nguyễn Văn C' },
    { id: 4, name: 'Nguyễn Văn D' }
  ],
  requests = [
    { id: 5, name: 'Nguyễn Văn E' },
    { id: 6, name: 'Nguyễn Văn F' },
    { id: 7, name: 'Nguyễn Văn G' }
  ],
  className = ''
}) => {
  const popupRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay để đóng popup khi click ngoài */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Popup content */}
      <div
        ref={popupRef}
        className={`w-72 bg-white rounded-lg shadow-xl z-50 ${className}`}
      >
        {/* Danh sách thành viên trong nhóm */}
        <div>
          <h3 className="px-4 py-3 text-sm font-semibold">Thành viên trong nhóm</h3>
          <div className="border-t border-gray-200">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center px-4 py-3 border-b border-gray-100"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  {member.name.charAt(0)}
                </div>
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách yêu cầu vào nhóm */}
        <div>
          <h3 className="px-4 py-3 text-sm font-semibold">Yêu cầu vào nhóm</h3>
          <div className="border-t border-gray-200">
            {requests.map(request => (
              <div
                key={request.id}
                className="flex items-center px-4 py-3 border-b border-gray-100"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  {request.name.charAt(0)}
                </div>
                <span>{request.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberListLeader;