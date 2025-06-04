import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import MemberLayout from '../../../../components/layoutPrimitives/MemberLayout';
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
          setGroupInfo(response.data);
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
  // Settings popup is handled by GroupHeader component

  const handleEditTime = () => {
    // Đang ở trang này nên không cần hành động
  };

  const handleEditLocation = () => {
    navigate(`/groups/${groupId}/member/location-preference`);
  };

  const handleViewEvent = () => {
    navigate(`/groups/${groupId}/member/event-viewer`);
  };
  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: handleEditTime },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: handleEditLocation },
    { label: 'Xem sự kiện', onClick: handleViewEvent },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}        showBackToGroups={true}
        isLeader={false}
      />
      
      {/* Main Content */}
      <MemberLayout rightButtons={rightButtons}>
        <div className="bg-white rounded-md shadow-sm overflow-hidden">          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thời gian</h2>
            <p className="text-sm text-gray-600 mt-1">
              Hãy cho biết thời gian bạn có thể tham gia sự kiện nhóm
            </p>
          </div>

          <div className="p-6">
            {/* Phần nội dung cập nhật thời gian rảnh sẽ tương tự như bên Leader */}            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <select className="border p-2 rounded">
                  <option>Tháng 6 - 2025</option>
                  <option>Tháng 7 - 2025</option>
                  <option>Tháng 8 - 2025</option>
                </select>
                <div>
                  <p className="text-sm mb-1">Ngày bắt đầu</p>
                  <input type="date" value="2025-06-01" className="border rounded p-2" />
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm mb-1">Ngày kết thúc</p>
                <input type="date" value="2025-06-07" className="border rounded p-2" />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <input type="radio" id="can-attend" name="attendance" className="mr-2" checked />
                  <label htmlFor="can-attend">Có thể tham gia</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="cannot-attend" name="attendance" className="mr-2" />
                  <label htmlFor="cannot-attend">Không thể tham gia</label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-2 border">Giờ</th>
                      <th className="p-2 border">Thứ 2</th>
                      <th className="p-2 border">Thứ 3</th>
                      <th className="p-2 border">Thứ 4</th>
                      <th className="p-2 border">Thứ 5</th>
                      <th className="p-2 border">Thứ 6</th>
                      <th className="p-2 border">Thứ 7</th>
                      <th className="p-2 border">CN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
                      <tr key={hour}>
                        <td className="p-2 border">{hour}:00</td>
                        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                          <td key={day} className="p-2 border">
                            <div className="w-full h-10 bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600">
                              <span className="text-white">✓</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div><div className="flex justify-end mt-8">
              <button 
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </MemberLayout>
    </div>
  );
};

export default TimeEditor;
