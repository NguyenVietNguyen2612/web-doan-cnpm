import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import ChoosePeriod from '../../../../components/groupWidgets/TimeManager/ChoosePeriod';
import { getGroupById } from '../../../../services/groupService';
import timeslotService from '../../../../services/timeslotService';

// Tạo mảng giờ từ 7h sáng đến 22h tối
const hoursArray = Array.from({ length: 16 }, (_, i) => {
  const hour = 7 + i;
  return `${hour}:00`;
});

  // Mảng các ngày trong tuần (khớp với JavaScript Date.getDay())
  const DAYS_OF_WEEK = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  
  // Mảng để hiển thị (CN ở cuối tuần)
  const DISPLAY_DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

// Month options for dropdown (June 2025 - June 2026)
const monthOptions = [
  { value: 6, year: 2025, label: 'Tháng 6 - 2025' },
  { value: 7, year: 2025, label: 'Tháng 7 - 2025' },
  { value: 8, year: 2025, label: 'Tháng 8 - 2025' },
  { value: 9, year: 2025, label: 'Tháng 9 - 2025' },
  { value: 10, year: 2025, label: 'Tháng 10 - 2025' },
  { value: 11, year: 2025, label: 'Tháng 11 - 2025' },
  { value: 12, year: 2025, label: 'Tháng 12 - 2025' },
  { value: 1, year: 2026, label: 'Tháng 1 - 2026' },
  { value: 2, year: 2026, label: 'Tháng 2 - 2026' },
  { value: 3, year: 2026, label: 'Tháng 3 - 2026' },
  { value: 4, year: 2026, label: 'Tháng 4 - 2026' },
  { value: 5, year: 2026, label: 'Tháng 5 - 2026' },
  { value: 6, year: 2026, label: 'Tháng 6 - 2026' },
];

const GroupCalendar = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  console.log('🏗️ GroupCalendar component initialized');
  console.log('🆔 GroupId from useParams:', groupId);
  
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });

  const [availabilityGrid, setAvailabilityGrid] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  // Debug dateRange changes
  useEffect(() => {
    console.log('📅 DateRange changed:', dateRange);
  }, [dateRange]);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Memoized handlers
  const handleMonthSelect = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowMonthDropdown(false);
    setCurrentWeek(0);
  }, []);

  // Debug currentWeek changes
  useEffect(() => {
    console.log('📊 CurrentWeek changed:', currentWeek);
  }, [currentWeek]);

  // Debug groupInfo changes
  useEffect(() => {
    console.log('👥 GroupInfo changed:', groupInfo);
    console.log('👥 Previous vs current:', {
      name: groupInfo.name,
      memberCount: groupInfo.memberCount,
      hasName: !!groupInfo.name,
      hasMemberCount: groupInfo.memberCount > 0
    });
  }, [groupInfo]);


  // Memoized navigation buttons
  const rightButtons = useMemo(() => [
    { label: 'Chỉnh sửa thời gian', onClick: () => navigate(`/groups/${groupId}/time-editor`) },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => {} },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ], [groupId, navigate]);

  // Calculate availability data from real timeslots
  const calculateAvailabilityData = useCallback(async () => {
    if (!dateRange.startDate || !groupInfo.memberCount) {
      console.log('⏸️ Skipping calculation - missing data:', { 
        dateRange: dateRange.startDate, 
        memberCount: groupInfo.memberCount 
      });
      return {};
    }
    
    try {
      console.log('📊 Calculating group availability for date range:', dateRange);
      console.log('👥 Group info:', groupInfo);
      
      // Get all group members' timeslots
      const response = await timeslotService.getGroupTimeslots(groupId);
      
      if (!response.success) {
        console.error('Failed to fetch group timeslots:', response.message);
        return {};
      }
      
      const groupTimeslots = response.data || [];
      console.log('📊 Retrieved group data:', groupTimeslots.length, 'users');
      console.log('📊 Sample user data:', groupTimeslots[0]);
      console.log('📊 All users timeslots:', groupTimeslots.map(user => ({
        user_id: user.user_id,
        timeslots_count: user.timeslots?.length || 0,
        sample_slot: user.timeslots?.[0]
      })));
      
      // Debug all timeslots với dates
      console.log('🗓️ ALL TIMESLOTS với dates:');
      groupTimeslots.forEach(user => {
        user.timeslots?.forEach(slot => {
          const slotDate = new Date(slot.start_time);
          console.log(`User ${user.user_id}: ${slot.start_time} → ngày ${slotDate.getDate()}/${slotDate.getMonth()+1} (${['CN','T2','T3','T4','T5','T6','T7'][slotDate.getDay()]})`);
        });
      });
      
      // Convert date range to week days using UTC to avoid timezone issues
      const startDate = new Date(dateRange.startDate);
      const weekDates = Array(7).fill().map((_, i) => {
        const date = new Date(startDate);
        date.setUTCDate(startDate.getUTCDate() + i);
        date.setUTCHours(0, 0, 0, 0); // Ensure start of day in UTC
        return date;
      });
      
      console.log('📅 Week dates being calculated:');
      weekDates.forEach((date, i) => {
        const dateStr = date.toISOString().split('T')[0];
        console.log(`Day ${i}: ${dateStr} → ngày ${date.getDate()}/${date.getMonth()+1} (${['CN','T2','T3','T4','T5','T6','T7'][date.getDay()]})`);
      });
      
      const availabilityData = {};
      
      // For each day of week - dùng DAYS_OF_WEEK để đồng bộ với TimeManager
      DAYS_OF_WEEK.forEach((dayName, dayIndex) => {
        availabilityData[dayName] = {};
        // Mapping đặc biệt: CN cần map sang cuối tuần, các ngày khác mapping trực tiếp
        const weekDateIndex = dayIndex === 0 ? 6 : dayIndex;
        const currentDate = weekDates[weekDateIndex];
        const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        console.log(`🔍 Processing ${dayName} day ${dayIndex} → weekDate ${weekDateIndex}: currentDate=${currentDate.getDate()}/${currentDate.getMonth()+1}, dateString=${dateString}`);
        
        // For each hour
        hoursArray.forEach(hour => {
          // Convert hour format from "7:00" to match database format
          const targetHour = parseInt(hour.split(':')[0]);
          
          // Count unique users available at this time slot
          const availableUsers = new Set();
          
          groupTimeslots.forEach(user => {
            user.timeslots.forEach(slot => {
              const slotStart = new Date(slot.start_time);
              const slotEnd = new Date(slot.end_time);
              
              // Check if timeslot is on the current date
              const slotDateString = slotStart.toISOString().split('T')[0];
              
              // Check if the hour falls within this timeslot
              const slotStartHour = slotStart.getHours();
              const slotEndHour = slotEnd.getHours();
              
              if (slotDateString === dateString && 
                  targetHour >= slotStartHour && 
                  targetHour < slotEndHour) {
                availableUsers.add(user.user_id);
              }
            });
          });
          
          // Calculate percentage
          const availableCount = availableUsers.size;
          const percentage = groupInfo.memberCount > 0 
            ? Math.round((availableCount / groupInfo.memberCount) * 100)
            : 0;
            
          availabilityData[dayName][hour] = percentage;
          
          // Debug for CN specifically and first day 7:00
          if ((dayName === 'CN' && hour === '7:00') || (dayIndex === 0 && hour === '7:00')) {
            console.log(`🔍 Debug ${dayName} ${hour}:`, {
              dayName,
              dayIndex,
              weekDateIndex,
              dateString,
              targetHour,
              availableUsers: Array.from(availableUsers),
              availableCount,
              totalMembers: groupInfo.memberCount,
              percentage,
              relevantSlots: groupTimeslots.flatMap(user => 
                user.timeslots.filter(slot => {
                  const slotStart = new Date(slot.start_time);
                  const slotDateString = slotStart.toISOString().split('T')[0];
                  return slotDateString === dateString;
                }).map(slot => ({
                  user_id: user.user_id,
                  start: slot.start_time,
                  end: slot.end_time,
                  startHour: new Date(slot.start_time).getHours(),
                  endHour: new Date(slot.end_time).getHours()
                }))
              )
            });
          }
        });
      });
      
      console.log('📊 Final availability data:', availabilityData);
      console.log('📊 CN data in final result:', availabilityData['CN']);
      return availabilityData;
      
    } catch (error) {
      console.error('Error calculating availability:', error);
      return {};
    }
  }, [dateRange, groupId, groupInfo.memberCount]);

  // Memoized color getter - đồng bộ với TimeManager
  const getAvailabilityColor = useCallback((percentage) => {
    if (percentage === undefined || percentage === 0) return 'bg-white hover:bg-gray-100';
    if (percentage >= 75) return 'bg-green-500 text-white';
    if (percentage >= 50) return 'bg-green-400 text-white';
    if (percentage >= 25) return 'bg-green-300 text-black';
    return 'bg-green-200 text-black';
  }, []);

  // Group data fetching effect
  // Initialize date range on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, initializing date range...');
    if (!dateRange.startDate) {
      // Calculate first week of default month (June 2025)
      const firstDayOfMonth = new Date(2025, 5, 1); // June 1, 2025
      const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Find the Monday of the first week
      const mondayOffset = dayOfWeek === 0 ? 1 : (8 - dayOfWeek); // Days to add to get to Monday
      const firstMonday = new Date(firstDayOfMonth);
      firstMonday.setDate(firstDayOfMonth.getDate() + mondayOffset);
      
      const firstSunday = new Date(firstMonday);
      firstSunday.setDate(firstMonday.getDate() + 6);
      
      const initialRange = {
        startDate: firstMonday,
        endDate: firstSunday
      };
      
      console.log('📅 Setting initial date range:', initialRange);
      setDateRange(initialRange);
    }
  }, []);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        console.log('🌐 API: Calling getGroupById with groupId:', groupId);
        const response = await getGroupById(groupId);
        console.log('📥 API: getGroupById response:', response);
        
        if (response.success) {
          console.log('✅ API success, response.data:', response.data);
          console.log('🔍 response.data keys:', Object.keys(response.data || {}));
          console.log('🔍 response.data.group_name:', response.data.group_name);
          console.log('🔍 response.data.memberCount:', response.data.memberCount);
          console.log('🔍 response.data full object:', JSON.stringify(response.data, null, 2));
          
          const groupData = {
            name: response.data.name,
            memberCount: response.data.memberCount
          };
          console.log('👥 Setting groupInfo to:', groupData);
          setGroupInfo(groupData);
        } else {
          console.error('❌ API failed with message:', response.message);
          console.error('❌ Full response:', response);
          alert('Không thể lấy thông tin nhóm. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('❌ Exception in fetchGroupData:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data
        });
        alert('Có lỗi xảy ra khi tải dữ liệu.');
      }
    };

    console.log('🔍 useEffect[groupId] triggered with groupId:', groupId);
    console.log('🔍 groupId type:', typeof groupId);
    console.log('🔍 groupId truthy:', !!groupId);
    
    if (groupId) {
      console.log('🚀 Starting fetchGroupData with groupId:', groupId);
      fetchGroupData();
    } else {
      console.log('⚠️ No groupId provided, skipping fetchGroupData');
    }
  }, [groupId]);

  // Load availability data when date range or group changes
  useEffect(() => {
    const loadAvailabilityData = async () => {
      console.log('🔄 useEffect triggered for loading availability data');
      console.log('- dateRange:', dateRange);
      console.log('- groupInfo:', groupInfo);
      console.log('- Conditions:', {
        hasStartDate: !!dateRange.startDate,
        hasMemberCount: groupInfo.memberCount > 0
      });
      
      if (dateRange.startDate && groupInfo.memberCount > 0) {
        console.log('✅ Conditions met, calling calculateAvailabilityData...');
        const data = await calculateAvailabilityData();
        console.log('📊 Setting availability grid with data:', data);
        setAvailabilityGrid(data);
      } else {
        console.log('❌ Conditions not met, skipping calculation');
        console.log('❓ Debug: memberCount type:', typeof groupInfo.memberCount);
        console.log('❓ Debug: memberCount value:', groupInfo.memberCount);
        
        // TODO: Remove this fallback after fixing API
        if (dateRange.startDate && groupInfo.memberCount === undefined) {
          console.log('🔧 FALLBACK: Using mock data for testing UI');
          const mockData = {};
          DAYS_OF_WEEK.forEach(day => {
            mockData[day] = {};
            hoursArray.forEach(hour => {
              // Random percentage for testing
              mockData[day][hour] = Math.floor(Math.random() * 101);
            });
          });
          console.log('📊 Setting mock availability grid:', mockData);
          setAvailabilityGrid(mockData);
        }
      }
    };
    
    loadAvailabilityData();
  }, [dateRange, calculateAvailabilityData, groupInfo.memberCount]);

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

  // Memoized dates display - map với DISPLAY_DAYS (CN ở cuối)
  const displayDates = useMemo(() => {
    console.log('💾 Calculating displayDates with dateRange:', dateRange);
    if (!dateRange.startDate) {
      console.log('❌ No startDate, returning empty array');
      return Array(7).fill('');
    }
    const startDate = new Date(dateRange.startDate); // startDate là Thứ 2
    
    // Tạo mảng ngày theo thứ tự: Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7, CN
    const dates = Array(7).fill().map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i); // +0, +1, +2, +3, +4, +5, +6
      return date.getDate().toString();
    });
    console.log('✅ DisplayDates calculated:', dates);
    return dates;
  }, [dateRange.startDate]);

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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Tiêu đề */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
              Lịch rảnh chung của cả nhóm
            </h2>
            <p className="text-sm text-gray-600 text-center">Xem mức độ rảnh của thành viên trong nhóm</p>
          </div>
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Month/Year */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Chọn tháng
                </span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="border border-gray-200 rounded-lg p-3 cursor-pointer flex items-center justify-between bg-gray-50"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                >
                  <span>Tháng {selectedMonth} - {selectedYear}</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {showMonthDropdown && (
                  <div className="absolute left-0 right-0 mt-1 border rounded-md bg-white z-10 shadow-lg">
                    {monthOptions.map(month => (
                      <div 
                        key={`${month.value}-${month.year}`} 
                        className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedMonth === month.value && selectedYear === month.year ? 'bg-gray-200' : ''}`}
                        onClick={() => handleMonthSelect(month.value, month.year)}
                      >
                        {month.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Week selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Chọn tuần
                </span>
              </label>
              <ChoosePeriod 
                month={selectedMonth} 
                year={selectedYear} 
                currentWeek={currentWeek}
                onPeriodChange={(newDateRange) => {
                  console.log('📅 ChoosePeriod called onPeriodChange with:', newDateRange);
                  console.log('- Setting dateRange from:', dateRange, 'to:', newDateRange);
                  setDateRange(newDateRange);
                }}
              />
            </div>
          </div>

          {/* Chú thích màu sắc */}
          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
              <span className="text-xs text-gray-700">75-100% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 mr-2 rounded"></div>
              <span className="text-xs text-gray-700">50-74% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 mr-2 rounded"></div>
              <span className="text-xs text-gray-700">25-49% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 mr-2 rounded"></div>
              <span className="text-xs text-gray-700">1-24% thành viên rảnh</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 mr-2 rounded"></div>
              <span className="text-xs text-gray-700">Không ai rảnh</span>
            </div>
          </div>
          {/* Bảng lịch */}
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <div className="min-w-max">
              {/* Header */}
              <div className="grid grid-cols-8 bg-purple-100 border-b border-gray-300" style={{ userSelect: 'none' }}>
                <div className="p-3 text-center font-medium border-r border-gray-300">Giờ</div>
                {DISPLAY_DAYS.map((day, displayIndex) => {
                  // displayIndex khớp hoàn toàn: 0=Thứ2, 1=Thứ3, ..., 6=CN
                  return (
                    <div key={day} className="p-3 text-center font-medium border-r border-gray-300 last:border-r-0">
                      <div>{day}</div>
                      <div className="text-xs text-gray-500">{displayDates[displayIndex]}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Time Rows */}
              {useMemo(() => 
                hoursArray.map(hour => (
                  <div 
                    key={hour} 
                    className={`grid grid-cols-8 border-b border-gray-200 last:border-b-0 ${parseInt(hour.split(':')[0]) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {/* Hour label */}
                    <div className="p-3 text-center font-medium border-r border-gray-300 bg-gray-100">
                      {hour}
                    </div>
                    
                    {/* Day cells */}
                    {DISPLAY_DAYS.map(day => {
                      const percentage = availabilityGrid[day] ? availabilityGrid[day][hour] : 0;
                      const colorClass = getAvailabilityColor(percentage);
                      
                      return (
                        <div 
                          key={`${day}-${hour}`} 
                          className={`${colorClass} border-r border-gray-200 last:border-r-0 min-h-[50px] p-3 text-center flex items-center justify-center`}
                          title={`${percentage}% thành viên rảnh vào ${day}, ${hour}`}
                        >
                          {percentage >= 1 && (
                            <div className="text-xs font-medium">
                              {percentage}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                                 )), [hoursArray, availabilityGrid, displayDates])}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
            <p className="text-sm text-blue-800">
              <strong>Hướng dẫn:</strong> Xem tỷ lệ phần trăm thành viên rảnh trong từng khung giờ. 
              Màu xanh đậm hơn tương ứng với nhiều thành viên rảnh hơn.
            </p>
          </div>
        </div>
      </LeaderLayout>
    </div>
  );
};

export default GroupCalendar;
