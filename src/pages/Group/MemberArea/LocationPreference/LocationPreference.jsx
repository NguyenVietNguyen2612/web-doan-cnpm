import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import MemberLayout from '../../../../components/layoutPrimitives/MemberLayout';
import { getGroupById } from '../../../../services/groupService';
import UpdateLocation from '../../../../components/groupWidgets/LocationAndPreference/UpdateLocation';
import UpdatePreference from '../../../../components/groupWidgets/LocationAndPreference/UpdatePreference';

/**
 * Component cho phép thành viên cập nhật vị trí và sở thích
 */
const LocationPreference = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  // State để lưu thông tin nhóm
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState({});

  // Danh sách các sở thích có thể chọn
  const preferenceOptions = [
    { id: 'cafe', label: 'Quán cà phê' },
    { id: 'movie', label: 'Rạp phim' },
    { id: 'restaurant', label: 'Quán ăn' },
    { id: 'mall', label: 'Trung tâm thương mại' },
    { id: 'park', label: 'Công viên' },
    { id: 'museum', label: 'Bảo tàng' },
    { id: 'library', label: 'Thư viện' }
  ];

  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo(response.data);
          setLocation('Đường T1, Đông Hòa, Dĩ An, Bình Dương'); // Mock data
          setPreferences({
            cafe: true,
            movie: true,
            restaurant: false,
            mall: true,
            park: false,
            museum: false,
            library: false
          }); // Mock data
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
  // Xử lý các hành động điều hướng
  const handleEditTime = () => {
    navigate(`/groups/${groupId}/member/time-editor`);
  };

  const handleEditLocation = () => {
    // Do nothing since we're already on this page
  };
  const handleViewEvent = () => {
    navigate(`/groups/${groupId}/member/event-viewer`);
  };

  const handleSettings = () => {
    alert('Tính năng cài đặt nhóm đang được phát triển');
  };
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handlePreferenceChange = (id) => {
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
        memberCount={groupInfo.memberCount || 0}
        onSettings={handleSettings}
        showBackToGroups={true}
        isLeader={false}
      />
      
      {/* Main Content */}
      <MemberLayout rightButtons={rightButtons}>
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa vị trí và sở thích</h2>
            <p className="text-sm text-gray-600 mt-1">
              Hãy cho biết vị trí và sở thích của bạn để chúng tôi gợi ý địa điểm phù hợp
            </p>
          </div>

          <div className="p-6">
            {/* Component UpdateLocation */}
            <UpdateLocation
              location={location}
              onLocationChange={handleLocationChange}
              isDisabled={false}
            />
              {/* Component UpdatePreference */}
            <UpdatePreference
              preferenceOptions={preferenceOptions}
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
              isDisabled={false}
              className="mb-6"
            />

            <div className="flex justify-end mt-8">
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

export default LocationPreference;
