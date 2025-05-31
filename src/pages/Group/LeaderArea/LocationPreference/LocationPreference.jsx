import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';

// Danh sách các sở thích có thể chọn
const preferenceOptions = [
  { id: 'cafe', label: 'Quán cà phê' },
  { id: 'cinema', label: 'Rạp phim' },
  { id: 'restaurant', label: 'Quán ăn' },
  { id: 'mall', label: 'Trung tâm thương mại' },
  { id: 'park', label: 'Công viên' },
  { id: 'zoo', label: 'Sở thú' },
  { id: 'museum', label: 'Bảo tàng' },
  { id: 'bookstore', label: 'Nhà sách' },
  { id: 'library', label: 'Thư viện' },
  { id: 'beach', label: 'Bãi biển' },
  { id: 'mountain', label: 'Núi' },
  { id: 'gallery', label: 'Phòng trưng bày' },
  { id: 'arcade', label: 'Khu trò chơi' },
  { id: 'gym', label: 'Phòng tập thể dục' },
  { id: 'club', label: 'Câu lạc bộ' },
];

const LocationPreference = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });

  // State cho vị trí và sở thích
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState({});
  
  // State để lưu trữ trạng thái ban đầu để phục hồi khi hủy
  const [originalLocation, setOriginalLocation] = useState('');
  const [originalPreferences, setOriginalPreferences] = useState({});

  // State để kiểm soát trạng thái chỉnh sửa
  const [hasChanges, setHasChanges] = useState(false);

  // Lấy thông tin nhóm khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo({
            name: response.data.name,
            memberCount: response.data.memberCount
          });
          
          // Giả lập dữ liệu vị trí và sở thích từ backend
          const mockLocation = 'Đường T1, Đông Hòa, Dĩ An, Bình Dương';
          const mockPreferences = {
            'cafe': true,
            'cinema': true,
            'restaurant': false,
            'mall': true,
            'park': false,
            'zoo': false
          };
          
          setLocation(mockLocation);
          setPreferences(mockPreferences);
          
          // Lưu trạng thái ban đầu để có thể khôi phục khi cần
          setOriginalLocation(mockLocation);
          setOriginalPreferences({...mockPreferences});
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

  // Kiểm tra thay đổi khi location hoặc preferences thay đổi
  useEffect(() => {
    const locationChanged = location !== originalLocation;
    
    let preferencesChanged = false;
    // Kiểm tra xem có sự thay đổi nào trong preferences không
    preferenceOptions.forEach(option => {
      if (preferences[option.id] !== originalPreferences[option.id]) {
        preferencesChanged = true;
      }
    });
    
    setHasChanges(locationChanged || preferencesChanged);
  }, [location, preferences, originalLocation, originalPreferences]);

  // Xử lý thay đổi vị trí
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Xử lý thay đổi sở thích
  const handlePreferenceChange = (id) => {
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Xử lý khi nhấn nút Lưu
  const handleSave = async () => {
    try {
      // Trong thực tế, ở đây sẽ gọi API để lưu dữ liệu
      // await saveLocationPreferences(groupId, { location, preferences });
      
      // Cập nhật trạng thái ban đầu để phản ánh các thay đổi đã lưu
      setOriginalLocation(location);
      setOriginalPreferences({...preferences});
      setHasChanges(false);
      
      alert('Đã lưu vị trí và sở thích thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau.');
    }
  };

  // Xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    // Khôi phục trạng thái ban đầu
    setLocation(originalLocation);
    setPreferences({...originalPreferences});
    setHasChanges(false);
    alert('Đã hủy các thay đổi!');
  };

  // Xử lý các hành động điều hướng
  const handleSettings = () => {
    alert('Tính năng cài đặt nhóm đang được phát triển');
  };

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => {} },
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
        onSettings={handleSettings}
        showBackToGroups={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <div className="bg-white p-4 rounded-md shadow-sm">
          {/* Vị trí */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Nhập vị trí</label>
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Nhập địa chỉ hoặc vị trí của bạn"
            />
          </div>
          
          {/* Sở thích */}
          <div>
            <label className="block text-sm font-medium mb-2">Chọn sở thích</label>
            <div className="bg-gray-200 rounded-md p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {preferenceOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={preferences[option.id] || false}
                      onChange={() => handlePreferenceChange(option.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor={option.id} className="ml-2 text-sm">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              onClick={handleCancel}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-md text-sm ${hasChanges 
                ? 'bg-purple-300 hover:bg-purple-400 transition-colors' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Hủy
            </button>
            <button 
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-md text-sm ${hasChanges 
                ? 'bg-purple-300 hover:bg-purple-400 transition-colors' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Lưu
            </button>
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default LocationPreference;
