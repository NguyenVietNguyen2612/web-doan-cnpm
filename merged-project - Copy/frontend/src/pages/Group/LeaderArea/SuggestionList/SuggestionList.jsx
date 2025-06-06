import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';

// Mock data cho các đề xuất địa điểm với thông tin phong phú hơn
const mockSuggestions = [
  {
    id: 1,
    name: 'Hijcha Coffee & Tea',
    category: 'Quán cà phê',
    openingHours: '07:00 - 22:00',
    days: 'Thứ 2 - Thứ 7',
    address: '30/4 Tân Lập, Đông Hòa, Dĩ An, Bình Dương',
    matchRate: 92,
    distance: 1.2,
    rating: 4.5,
    reviewCount: 127,
         priceRange: '₫₫',
     matchReasons: ['Quán cà phê (3/5 thành viên thích)', 'Gần vị trí trung tâm nhóm'],
    phone: '0123 456 789'
  },
  {
    id: 2,
    name: 'Cf Góc Phố',
    category: 'Quán cà phê',
    openingHours: '06:00 - 22:00',
    days: 'Thứ 2 - Chủ nhật',
    address: 'Đường T1, Đông Hòa, Dĩ An, Bình Dương',
    matchRate: 87,
    distance: 0.8,
    rating: 4.3,
    reviewCount: 89,
         priceRange: '₫',
     matchReasons: ['Quán cà phê (3/5 thành viên thích)', 'Khoảng cách gần nhất'],
    phone: '0123 456 788'
  },
  {
    id: 3,
    name: 'Lẩu Chay Thiên Duyên',
    category: 'Quán ăn',
    openingHours: '11:00 - 22:00',
    days: 'Thứ 2 - Chủ nhật',
    address: 'Đường Trực Chính 10, Linh Trung, Thủ Đức, TP. HCM',
    matchRate: 75,
    distance: 2.5,
    rating: 4.7,
    reviewCount: 234,
         priceRange: '₫₫₫',
     matchReasons: ['Quán ăn (4/5 thành viên thích)', 'Đánh giá cao từ khách hàng'],
    phone: '0123 456 787'
  },
  {
    id: 4,
    name: 'Quán Ngon Phố',
    category: 'Quán ăn',
    openingHours: '09:00 - 23:00',
    days: 'Thứ 2 - Chủ nhật',
    address: 'Đường Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP. HCM',
    matchRate: 72,
    distance: 3.1,
    rating: 4.2,
    reviewCount: 156,
         priceRange: '₫₫',
     matchReasons: ['Quán ăn (4/5 thành viên thích)', 'Mở cửa muộn phù hợp lịch trình'],
    phone: '0123 456 786'
  },
  {
    id: 5,
    name: 'Galaxy Cinema Thủ Đức',
    category: 'Rạp phim',
    openingHours: '08:00 - 24:00',
    days: 'Thứ 2 - Chủ nhật',
    address: 'TTTM Vincom Plaza Thủ Đức, TP. HCM',
    matchRate: 68,
    distance: 4.2,
    rating: 4.4,
    reviewCount: 892,
         priceRange: '₫₫₫',
     matchReasons: ['Rạp phim (2/5 thành viên thích)', 'Có nhiều suất chiếu'],
    phone: '0123 456 785'
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
  const [sortBy, setSortBy] = useState('matchRate'); // matchRate, distance, rating
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Lấy thông tin nhóm và tạo đề xuất thực tế
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin nhóm
        const groupResponse = await getGroupById(groupId);
        if (groupResponse.success) {
          setGroupInfo({
            name: groupResponse.data.name,
            memberCount: groupResponse.data.memberCount
          });
        }

        // Sử dụng mock data
        setSuggestions(mockSuggestions);
        
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        // Fallback: sử dụng mock data
        setSuggestions(mockSuggestions);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);



  // Xử lý sự kiện khi nhấn nút "Thêm vào sự kiện"
  const handleAddToEvent = (suggestion) => {
    // Trong thực tế, sẽ gọi API để thêm địa điểm vào sự kiện
    alert(`Đã thêm "${suggestion.name}" vào danh sách sự kiện!`);
    navigate(`/groups/${groupId}/event-manager`);
  };

  // Lọc và sắp xếp danh sách đề xuất
  const getFilteredAndSortedSuggestions = () => {
    let filtered = suggestions;
    
    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'matchRate':
        default:
          return b.matchRate - a.matchRate;
      }
    });
    
    return filtered;
  };

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => {} },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ];

  // Component cho match rate badge
  const MatchRateBadge = ({ rate }) => {
    const getColor = () => {
      if (rate >= 90) return 'bg-green-500';
      if (rate >= 75) return 'bg-blue-500';
      if (rate >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className={`${getColor()} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
        {rate}% phù hợp
      </div>
    );
  };

  // Component cho rating stars
  const StarRating = ({ rating, reviewCount }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">({reviewCount})</span>
      </div>
    );
  };

  // Hàm render mỗi đề xuất trong danh sách
  const renderSuggestionCard = (suggestion) => (
    <div key={suggestion.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{suggestion.name}</h3>
            <p className="text-purple-600 font-medium text-sm">{suggestion.category}</p>
          </div>
          <MatchRateBadge rate={suggestion.matchRate} />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{suggestion.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💰</span>
            <span>{suggestion.priceRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📞</span>
            <span>{suggestion.phone}</span>
          </div>
        </div>

        <StarRating rating={suggestion.rating} reviewCount={suggestion.reviewCount} />
      </div>

             {/* Body */}
       <div className="p-6">
         <div className="grid md:grid-cols-2 gap-6">
           {/* Thông tin chính */}
           <div className="space-y-4">
             <div>
               <h4 className="font-semibold text-gray-800 mb-2">📍 Địa chỉ</h4>
               <p className="text-gray-600 text-sm">{suggestion.address}</p>
             </div>
             
             <div>
               <h4 className="font-semibold text-gray-800 mb-2">🕐 Giờ mở cửa</h4>
               <p className="text-gray-600 text-sm">{suggestion.openingHours} • {suggestion.days}</p>
             </div>
           </div>

           {/* Thông tin phụ */}
           <div className="space-y-4">
             <div>
               <h4 className="font-semibold text-gray-800 mb-2">✨ Lý do phù hợp</h4>
               <ul className="space-y-1">
                 {suggestion.matchReasons.map((reason, index) => (
                   <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                     {reason}
                   </li>
                 ))}
               </ul>
             </div>
           </div>
         </div>
       </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: hôm nay
          </div>
          <button
            onClick={() => handleAddToEvent(suggestion)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            ➕ Thêm vào sự kiện
          </button>
        </div>
      </div>
    </div>
  );

  const filteredSuggestions = getFilteredAndSortedSuggestions();
  const categories = ['all', ...new Set(suggestions.map(s => s.category))];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">🎯 Đề xuất địa điểm cho nhóm</h1>
              <p className="text-gray-600">Dựa trên vị trí và sở thích của {groupInfo.memberCount} thành viên</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Danh mục:</span>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="all">Tất cả</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="matchRate">Độ phù hợp</option>
                    <option value="distance">Khoảng cách</option>
                    <option value="rating">Đánh giá</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-purple-600">{filteredSuggestions.length}</span> địa điểm
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Đang phân tích dữ liệu và tạo đề xuất...</p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy đề xuất phù hợp</h3>
                <p className="text-gray-600 mb-4">Hãy thử điều chỉnh bộ lọc hoặc cập nhật thông tin vị trí và sở thích của nhóm</p>
                <button 
                  onClick={() => navigate(`/groups/${groupId}/location-preference`)}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Cập nhật sở thích
                </button>
              </div>
            ) : (
              filteredSuggestions.map(renderSuggestionCard)
            )}
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default SuggestionList;
