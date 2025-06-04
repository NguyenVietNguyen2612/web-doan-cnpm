import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import Scrollbar from '../../../../components/common/Scrollbar';
import { getGroupById } from '../../../../services/groupService';

// Mock data cho các đề xuất địa điểm
const mockSuggestions = [
  {
    id: 1,
    name: 'Hijcha Coffee & Tea',
    image: '/src/assets/icons/cafe.jpg', // Giả định có ảnh này
    openingHours: 'Mở cửa từ 7h - 22h, T2 - T7',
    address: 'Địa chỉ: 30/4 Tân Lập, Đông Hòa, Dĩ An, Bình Dương',
    matchRate: 85,
    distance: 1.2,
  },
  {
    id: 2,
    name: 'Cf Góc Phố',
    image: '/src/assets/icons/cafe2.jpg', // Giả định có ảnh này
    openingHours: 'Mở cửa từ 6h - 22h, T2 - CN',
    address: 'Địa chỉ: Đường T1, Đông Hòa, Dĩ An, Bình Dương',
    matchRate: 75,
    distance: 0.8,
  },
  {
    id: 3,
    name: 'Lẩu Chay Thiên Duyên',
    image: '/src/assets/icons/restaurant.jpg', // Giả định có ảnh này
    openingHours: 'Mở cửa từ 11h - 22h, T2 - CN',
    address: 'Địa chỉ: Đường Trực Chính 10, Linh Trung, Thủ Đức, TP. HCM',
    matchRate: 65,
    distance: 2.5,
  },
  {
    id: 4,
    name: 'Quán Ngon Phố',
    image: '/src/assets/icons/restaurant2.jpg', // Giả định có ảnh này
    openingHours: 'Mở cửa từ 9h - 23h, T2 - CN',
    address: 'Địa chỉ: Đường Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP. HCM',
    matchRate: 60,
    distance: 3.1,
  },
  {
    id: 5,
    name: 'Galaxy Cinema',
    image: '/src/assets/icons/cinema.jpg', // Giả định có ảnh này
    openingHours: 'Mở cửa từ 8h - 24h, T2 - CN',
    address: 'Địa chỉ: TTTM Vincom Thủ Đức, TP. HCM',
    matchRate: 55,
    distance: 4.2,
  },
];

const SuggestionList = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin nhóm và danh sách đề xuất khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin nhóm
        const groupResponse = await getGroupById(groupId);
        if (groupResponse.success) {
          setGroupInfo({
            name: groupResponse.data.name,
            memberCount: groupResponse.data.memberCount
          });
        }

        // Trong thực tế sẽ gọi API để lấy danh sách đề xuất
        // const suggestionsResponse = await getSuggestions(groupId);
        // setSuggestions(suggestionsResponse.data);
        
        // Mock data
        setSuggestions(mockSuggestions);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  // Xử lý sự kiện khi nhấn nút "Thêm vào sự kiện"
  const handleAddToEvent = (suggestionId) => {
    // Trong thực tế, sẽ gọi API để thêm địa điểm vào sự kiện
    alert(`Đã thêm địa điểm id=${suggestionId} vào sự kiện.`);
    navigate(`/groups/${groupId}/event-manager`);
  };
  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => {} },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ];

  // Hàm render mỗi đề xuất trong danh sách
  const renderSuggestionItem = (suggestion) => (
    <div key={suggestion.id} className="border rounded-lg overflow-hidden mb-4">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <h3 className="text-purple-600 font-semibold text-lg">{suggestion.name}</h3>
          <p className="text-sm my-2">{suggestion.openingHours}</p>
          <p className="text-sm">{suggestion.address}</p>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
            {/* Trong thực tế sẽ hiển thị ảnh thật */}
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              Hình ảnh
            </div>
          </div>
          <button
            onClick={() => handleAddToEvent(suggestion.id)}
            className="mt-2 md:mt-0 bg-purple-300 py-2 px-4 rounded-md hover:bg-purple-400 transition-colors text-sm font-medium"
          >
            Thêm vào sự kiện
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <div className="bg-white p-4 rounded-md shadow-sm">
          {/* Tiêu đề */}
          <h2 className="text-xl font-bold text-center mb-6">Các đề xuất cho bạn</h2>
          
          {/* Danh sách đề xuất với scroll */}
          <Scrollbar className="pr-2" height="calc(100vh - 220px)" thumbColor="rgba(168, 85, 247, 0.5)" autoHide={false}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p>Không có đề xuất nào phù hợp.</p>
              </div>
            ) : (
              <div>
                {suggestions.map(renderSuggestionItem)}
              </div>
            )}
          </Scrollbar>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default SuggestionList;
