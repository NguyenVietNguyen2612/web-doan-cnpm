import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import ChoosePeriod from '../../../../components/groupWidgets/TimeManager/ChoosePeriod';
import { getGroupById } from '../../../../services/groupService';

// Tạo mảng giờ từ 7h sáng đến 22h tối
const hoursArray = Array.from({ length: 16 }, (_, i) => {
  const hour = 7 + i;
  return `${hour}:00`;
});

// Mảng các ngày trong tuần
const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

const GroupCalendar = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });

  const [availabilityGrid, setAvailabilityGrid] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [currentWeek, setCurrentWeek] = useState(0);

  // Memoized handlers
  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
    setCurrentWeek(0);
  }, []);

  const handleSettings = useCallback(() => {
    alert('Tính năng cài đặt nhóm đang được phát triển');
  }, []);

  // Memoized navigation buttons
  const rightButtons = useMemo(() => [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => {} },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ], [groupId, navigate]);

  // Memoized mock data
  const mockData = useMemo(() => {
    if (!dateRange.startDate) return {};
    
    const data = {};
    DAYS_OF_WEEK.forEach(day => {
      data[day] = {};
      hoursArray.forEach(hour => {
        const percentAvailable = Math.floor(Math.random() * 101);
        data[day][hour] = percentAvailable;
      });
    });
    return data;
  }, [dateRange.startDate]);

  // Memoized color getter
  const getAvailabilityColor = useCallback((percentage) => {
    if (percentage === undefined) return 'bg-white';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-green-300';
    if (percentage >= 25) return 'bg-green-200';
    if (percentage > 0) return 'bg-green-100';
    return 'bg-white';
  }, []);

  // Group data fetching effect
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await getGroupById(groupId);
        if (response.success) {
          setGroupInfo({
            name: response.data.name,
            memberCount: response.data.memberCount
          });
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

  // Set availability grid when mock data changes
  useEffect(() => {
    if (Object.keys(mockData).length > 0) {
      setAvailabilityGrid(mockData);
    }
  }, [mockData]);

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized dates display
  const displayDates = useMemo(() => {
    if (!dateRange.startDate) {
      return Array(7).fill('');
    }
    const startDate = new Date(dateRange.startDate);
    return Array(7).fill().map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.getDate().toString();
    });
  }, [dateRange.startDate]);

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
                  {monthOptions.map(month => (
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
            </div>            {/* Chọn khoảng ngày */}
            <ChoosePeriod 
              month={selectedMonth} 
              year={new Date().getFullYear()} 
              currentWeek={currentWeek}              onPeriodChange={setDateRange} // Dữ liệu sẽ tự động được cập nhật qua mockData useMemo
            />
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
            <table className="w-full border-collapse border">              <thead>
                <tr>
                  <th className="border p-2 text-center w-20">Giờ</th>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <th key={day} className="border p-2 text-center">
                      <div>{day}</div>
                      <div className="text-xs text-gray-500">{displayDates[index]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>                {useMemo(() => 
                  hoursArray.map(hour => (
                    <tr key={hour}>
                      <td className="border p-2 text-center">{hour}</td>
                      {DAYS_OF_WEEK.map(day => {
                        const percentage = availabilityGrid[day] ? availabilityGrid[day][hour] : 0;
                        const colorClass = getAvailabilityColor(percentage);
                        
                        return (
                          <td 
                            key={`${day}-${hour}`} 
                            className={`border p-2 ${colorClass}`}
                            title={`${percentage}% thành viên rảnh`}
                          >
                            {percentage > 0 && percentage > 50 && (
                              <div className="text-xs text-center font-medium text-black">{percentage}%</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>                  )), [hoursArray, availabilityGrid])}
              </tbody>
            </table>
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default GroupCalendar;
