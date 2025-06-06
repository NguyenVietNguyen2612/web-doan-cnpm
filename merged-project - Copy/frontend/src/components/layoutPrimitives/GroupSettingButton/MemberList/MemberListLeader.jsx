import React, { useRef, useEffect, useState } from 'react';
import MemberInfor from '../../MemberInfor';
import RequestInfo from './RequestInfo';
import Scrollbar from '../../../common/Scrollbar';

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
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'Trưởng nhóm' },
    { id: 2, name: 'Nguyễn Văn B', email: 'nguyenvanb@gmail.com', role: 'Thành viên' },
    { id: 3, name: 'Nguyễn Văn C', email: 'nguyenvanc@gmail.com', role: 'Thành viên' },
    { id: 4, name: 'Nguyễn Văn D', email: 'nguyenvand@gmail.com', role: 'Thành viên' }
  ],
  requests = [
    { id: 5, name: 'Nguyễn Văn E' },
    { id: 6, name: 'Nguyễn Văn F' },
    { id: 7, name: 'Nguyễn Văn G' }
  ],
  className = ''
}) => {
  const popupRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [membersList, setMembersList] = useState(members);
  const [requestsList, setRequestsList] = useState(requests);

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
      x: rect.left - 290, // Hiển thị popup bên trái của tên thành viên (280px width + 10px spacing)
      y: rect.top - (elementHeight / 3) // Căn giữa theo chiều dọc với tên thành viên
    });
  };

  // Xử lý khi click vào yêu cầu tham gia
  const handleRequestClick = (request, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const elementHeight = rect.height;
    setSelectedRequest(request);
    setPopupPosition({
      x: rect.left - 290,
      y: rect.top - (elementHeight / 3)
    });
  };

  // Xử lý khi đồng ý yêu cầu tham gia
  const handleAcceptRequest = () => {
    // Thêm người dùng vào danh sách thành viên
    const newMember = {
      id: selectedRequest.id,
      name: selectedRequest.name,
      email: selectedRequest.email || `${selectedRequest.name.toLowerCase().replace(/ /g, '')}@gmail.com`,
      role: 'Thành viên'
    };
    
    setMembersList(prev => [...prev, newMember]);
    
    // Xóa khỏi danh sách yêu cầu
    setRequestsList(prev => prev.filter(req => req.id !== selectedRequest.id));
    
    // Đóng popup thông tin
    setSelectedRequest(null);
    
    // TODO: Gọi API để cập nhật trạng thái trong database
  };

  // Xử lý khi từ chối yêu cầu tham gia
  const handleDenyRequest = () => {
    // Xóa khỏi danh sách yêu cầu
    setRequestsList(prev => prev.filter(req => req.id !== selectedRequest.id));
    
    // Đóng popup thông tin
    setSelectedRequest(null);
    
    // TODO: Gọi API để cập nhật trạng thái trong database
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay để đóng popup khi click ngoài */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => {
          setSelectedMember(null);
          setSelectedRequest(null);
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
          <Scrollbar height="200px" className="border-t border-gray-200">
            {membersList.map(member => (
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

        {/* Danh sách yêu cầu vào nhóm */}
        <div>
          <h3 className="px-4 py-3 text-sm font-semibold">Yêu cầu vào nhóm</h3>
          <Scrollbar height="150px" className="border-t border-gray-200">
            {requestsList.map(request => (
              <div
                key={request.id}
                className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={(e) => handleRequestClick(request, e)}
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  {request.name.charAt(0)}
                </div>
                <span>{request.name}</span>
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

      {/* Request Info Popup */}
      <RequestInfo
        request={selectedRequest}
        isVisible={selectedRequest !== null}
        position={popupPosition}
        onAccept={handleAcceptRequest}
        onDeny={handleDenyRequest}
      />
    </>
  );
};

export default MemberListLeader;