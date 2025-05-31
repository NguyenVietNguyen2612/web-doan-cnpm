import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';

// Tạo mảng giờ từ 7h sáng đến 22h tối
const hoursArray = Array.from({ length: 16 }, (_, i) => {
  const hour = 7 + i;
  return `${hour}:00`;
});

// Hàm lấy ngày trong tuần
const getDaysOfWeek = () => {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  return days;
};

const GroupCalendar = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });

  // State cho bảng lịch rảnh chung
  const [availabilityGrid, setAvailabilityGrid] = useState({});
    // State cho dropdown tháng
  const [selectedMonth, setSelectedMonth] = useState(5); // Tháng 5 mặc định
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // State cho khoảng ngày hiển thị (tối đa 7 ngày)
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  // Hàm tạo dữ liệu giả lập cho bảng lịch rảnh chung
  const generateMockAvailabilityData = () => {
    const days = getDaysOfWeek();
    const mockData = {};
    
    days.forEach(day => {
      mockData[day] = {};
      hoursArray.forEach(hour => {
        // Mô phỏng dữ liệu: Giá trị từ 0-100 đại diện cho % thành viên rảnh
        const percentAvailable = Math.floor(Math.random() * 101);
        mockData[day][hour] = percentAvailable;
      });
    });
    
    return mockData;
  };
  // Hàm định dạng ngày theo format dd/MM/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm tính toán ngày bắt đầu và kết thúc dựa trên tuần hiện tại của tháng đã chọn
  const calculateDateRange = (month, weekOffset = 0) => {
    const currentYear = new Date().getFullYear();
    // Tạo ngày đầu tiên của tháng đã chọn
    const firstDayOfMonth = new Date(currentYear, month - 1, 1);
    
    // Tìm ngày thứ 2 đầu tiên trong tháng hoặc ngày đầu tiên nếu nó là thứ 2
    let startDay = new Date(firstDayOfMonth);
    while (startDay.getDay() !== 1) { // 1 là thứ 2
      startDay.setDate(startDay.getDate() + 1);
    }
    
    // Cộng thêm offset tuần nếu cần
    startDay.setDate(startDay.getDate() + (weekOffset * 7));
    
    // Tính ngày kết thúc (6 ngày sau ngày bắt đầu để có tổng 7 ngày)
    let endDay = new Date(startDay);
    endDay.setDate(endDay.getDate() + 6);
    
    return {
      startDate: startDay,
      endDate: endDay
    };
  };

  // Lấy thông tin nhóm và dữ liệu lịch rảnh khi component được mount
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo({
            name: response.data.name,
            memberCount: response.data.memberCount
          });
          
          // Tạo dữ liệu giả lập cho bảng lịch rảnh chung
          const mockGrid = generateMockAvailabilityData();
          setAvailabilityGrid(mockGrid);
          
          // Thiết lập khoảng ngày mặc định (tuần đầu tiên của tháng đã chọn)
          const initialDateRange = calculateDateRange(selectedMonth);
          setDateRange(initialDateRange);
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

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Tạo danh sách dropdown các tháng
  const generateMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const months = [
      { value: 3, label: `Tháng 3 - ${currentYear}` },
      { value: 4, label: `Tháng 4 - ${currentYear}` },
      { value: 5, label: `Tháng 5 - ${currentYear}` },
      { value: 6, label: `Tháng 6 - ${currentYear}` },
      { value: 7, label: `Tháng 7 - ${currentYear}` },
      { value: 8, label: `Tháng 8 - ${currentYear}` }
    ];
    return months;
  };
  // State cho việc chọn tuần trong tháng
  const [currentWeek, setCurrentWeek] = useState(0);

  // Hàm xử lý khi chọn tháng từ dropdown
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
    setCurrentWeek(0); // Reset về tuần đầu tiên khi chọn tháng mới
    
    // Tính lại khoảng ngày cho tháng mới
    const newDateRange = calculateDateRange(month, 0);
    setDateRange(newDateRange);
    
    // Trong trường hợp thực tế, ở đây sẽ gọi API để lấy dữ liệu của tháng đã chọn
    // Tạm thời tạo dữ liệu giả lập mới
    const mockGrid = generateMockAvailabilityData();
    setAvailabilityGrid(mockGrid);
  };
  
  // Hàm xử lý khi chọn tuần trước đó
  const handlePreviousWeek = () => {
    if (currentWeek > 0) {
      const newWeek = currentWeek - 1;
      setCurrentWeek(newWeek);
      
      const newDateRange = calculateDateRange(selectedMonth, newWeek);
      setDateRange(newDateRange);
      
      // Trong thực tế sẽ gọi API để lấy dữ liệu mới
      const mockGrid = generateMockAvailabilityData();
      setAvailabilityGrid(mockGrid);
    }
  };
  
  // Hàm xử lý khi chọn tuần tiếp theo
  const handleNextWeek = () => {
    // Giả sử tối đa 5 tuần trong một tháng
    if (currentWeek < 4) {
      const newWeek = currentWeek + 1;
      setCurrentWeek(newWeek);
      
      const newDateRange = calculateDateRange(selectedMonth, newWeek);
      setDateRange(newDateRange);
      
      // Trong thực tế sẽ gọi API để lấy dữ liệu mới
      const mockGrid = generateMockAvailabilityData();
      setAvailabilityGrid(mockGrid);
    }
  };

  // Hàm lấy màu dựa trên % thành viên rảnh
  const getAvailabilityColor = (percentage) => {
    if (percentage === undefined) return 'bg-white';
    
    if (percentage >= 75) return 'bg-green-500'; // Xanh đậm khi >= 75% thành viên rảnh
    if (percentage >= 50) return 'bg-green-300'; // Xanh vừa khi >= 50% thành viên rảnh
    if (percentage >= 25) return 'bg-green-200'; // Xanh nhạt khi >= 25% thành viên rảnh
    if (percentage > 0) return 'bg-green-100'; // Xanh rất nhạt khi > 0% thành viên rảnh
    return 'bg-white'; // Trắng khi không ai rảnh
  };

  // Hàm xử lý các hành động điều hướng
  const handleSettings = () => {
    alert('Tính năng cài đặt nhóm đang được phát triển');
  };

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => {} },
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
          {/* Tiêu đề */}
          <h2 className="text-xl font-bold text-center mb-6">Lịch rảnh chung của cả nhóm</h2>
            {/* Dropdown Tháng và Chọn Khoảng Ngày */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            {/* Dropdown Tháng */}
            <div className="relative w-64" ref={dropdownRef}>
              <div 
                className="border rounded-md p-2 cursor-pointer flex items-center justify-between"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              >
                <span>Tháng {selectedMonth} - {new Date().getFullYear()}</span>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              {showMonthDropdown && (
                <div className="absolute left-0 right-0 mt-1 border rounded-md bg-white z-10 shadow-lg">
                  {generateMonthOptions().map(month => (
                    <div 
                      key={month.value} 
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedMonth === month.value ? 'bg-gray-200' : ''}`}
                      onClick={() => handleMonthSelect(month.value)}
                    >
                      {month.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chọn khoảng ngày */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePreviousWeek}
                disabled={currentWeek === 0}
                className={`p-1 rounded ${currentWeek === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="border rounded-md p-2 bg-purple-100 flex items-center">
                <span className="text-sm">
                  {dateRange.startDate && dateRange.endDate
                    ? `Từ ${formatDate(dateRange.startDate)} đến ${formatDate(dateRange.endDate)}`
                    : 'Đang tải...'}
                </span>
              </div>
              
              <button 
                onClick={handleNextWeek}
                disabled={currentWeek >= 4}
                className={`p-1 rounded ${currentWeek >= 4 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chú thích màu sắc */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-1"></div>
              <span className="text-xs">75-100% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 mr-1"></div>
              <span className="text-xs">50-74% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 mr-1"></div>
              <span className="text-xs">25-49% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 mr-1"></div>
              <span className="text-xs">1-24% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border mr-1"></div>
              <span className="text-xs">Không ai rảnh</span>
            </div>
          </div>          {/* Bảng lịch */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2 text-center w-20">Giờ</th>
                  {getDaysOfWeek().map((day, index) => {
                    // Tính ngày hiển thị cho mỗi cột
                    let displayDate = '';
                    if (dateRange.startDate) {
                      const date = new Date(dateRange.startDate);
                      date.setDate(date.getDate() + index);
                      displayDate = date.getDate().toString();
                    }
                    
                    return (
                      <th key={day} className="border p-2 text-center">
                        <div>{day}</div>
                        <div className="text-xs text-gray-500">{displayDate}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {hoursArray.map(hour => (
                  <tr key={hour}>
                    <td className="border p-2 text-center">{hour}</td>
                    {getDaysOfWeek().map(day => {
                      const percentage = availabilityGrid[day] ? availabilityGrid[day][hour] : 0;
                      const colorClass = getAvailabilityColor(percentage);
                      
                      return (
                        <td 
                          key={`${day}-${hour}`} 
                          className={`border p-2 ${colorClass}`}
                          title={`${percentage}% thành viên rảnh`}
                        >
                          {/* Hiển thị % nếu muốn */}
                          {percentage > 0 && percentage > 50 && (
                            <div className="text-xs text-center font-medium text-black">{percentage}%</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default GroupCalendar;
