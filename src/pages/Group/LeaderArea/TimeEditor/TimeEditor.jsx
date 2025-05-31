import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import { getGroupById } from '../../../../services/groupService';

// Hàm để tạo ngày từ chuỗi ngày tháng năm dạng yyyy-mm-dd (định dạng chuẩn cho input type="date")
const parseDate = (dateString) => {
  if (!dateString) return new Date();
  return new Date(dateString);
};

// Hàm để định dạng ngày thành chuỗi yyyy-mm-dd
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// Tạo mảng giờ từ 7h sáng đến 22h tối
const hoursArray = Array.from({ length: 16 }, (_, i) => 7 + i);

// Tạo danh sách dropdown các tháng (bắt đầu từ tháng hiện tại và 6 tháng tiếp theo)
const generateMonthOptions = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentYear = today.getFullYear();
  
  const months = [];
  for (let i = 0; i < 7; i++) {
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    months.push({ 
      value: month + 1, 
      year: year,
      label: `Tháng ${month + 1} - ${year}` 
    });
  }
  return months;
};

const TimeEditor = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    memberCount: 0,
  });
  // Lấy ngày hiện tại và ngày kết thúc (7 ngày sau)
  const today = new Date();
  const defaultEndDate = new Date(today);
  defaultEndDate.setDate(today.getDate() + 6); // 7 ngày tính cả ngày hiện tại
  
  // State cho các ngày được chọn
  const [selectedDayRange, setSelectedDayRange] = useState({
    startDate: formatDate(today),
    endDate: formatDate(defaultEndDate)
  });
  
  const [availabilityGrid, setAvailabilityGrid] = useState({});
  const [originalGrid, setOriginalGrid] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // State cho dropdown tháng
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
          
          // Tạo lưới giả lập trạng thái rảnh/bận
          const mockGrid = {};
          const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
          days.forEach(day => {
            mockGrid[day] = {};
            hoursArray.forEach(hour => {
              mockGrid[day][hour] = Math.random() > 0.7; // 30% xác suất là rảnh (true)
            });
          });
          
          setAvailabilityGrid(mockGrid);
          setOriginalGrid(JSON.parse(JSON.stringify(mockGrid)));
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
  // Xử lý thay đổi trạng thái ô
  const toggleCellAvailability = (day, hour) => {
    setAvailabilityGrid(prevGrid => {
      const newGrid = {...prevGrid};
      newGrid[day] = {...newGrid[day]};
      newGrid[day][hour] = !newGrid[day][hour];
      setHasChanges(true);
      return newGrid;
    });
  };

  // Xử lý khi nhập ngày bắt đầu
  const handleStartDateChange = (e) => {
    const inputDate = e.target.value;
    // Kiểm tra nếu ngày hợp lệ và không vượt quá 7 ngày so với ngày kết thúc
    if (inputDate) {
      const startDate = new Date(inputDate);
      const endDate = new Date(selectedDayRange.endDate);
      
      // Tính số ngày giữa startDate và endDate
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 6 && startDate <= endDate) { // 7 ngày tính cả ngày bắt đầu
        setSelectedDayRange({
          ...selectedDayRange,
          startDate: inputDate
        });
      } else if (startDate > endDate) {
        // Nếu ngày bắt đầu sau ngày kết thúc, cập nhật cả hai
        const newEndDate = new Date(startDate);
        newEndDate.setDate(startDate.getDate() + 6); // Thêm 6 ngày để có tổng 7 ngày
        
        setSelectedDayRange({
          startDate: inputDate,
          endDate: formatDate(newEndDate)
        });
      } else {
        // Nếu khoảng thời gian > 7 ngày, cập nhật ngày kết thúc
        const newEndDate = new Date(startDate);
        newEndDate.setDate(startDate.getDate() + 6); // Thêm 6 ngày để có tổng 7 ngày
        
        setSelectedDayRange({
          startDate: inputDate,
          endDate: formatDate(newEndDate)
        });
      }
    }
  };

  // Xử lý khi nhập ngày kết thúc
  const handleEndDateChange = (e) => {
    const inputDate = e.target.value;
    // Kiểm tra nếu ngày hợp lệ và không vượt quá 7 ngày so với ngày bắt đầu
    if (inputDate) {
      const startDate = new Date(selectedDayRange.startDate);
      const endDate = new Date(inputDate);
      
      // Tính số ngày giữa startDate và endDate
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 6 && startDate <= endDate) { // 7 ngày tính cả ngày bắt đầu
        setSelectedDayRange({
          ...selectedDayRange,
          endDate: inputDate
        });
      } else if (startDate > endDate) {
        // Nếu ngày kết thúc trước ngày bắt đầu, cập nhật cả hai
        const newStartDate = new Date(endDate);
        newStartDate.setDate(endDate.getDate() - 6); // Lùi 6 ngày để có tổng 7 ngày
        
        setSelectedDayRange({
          startDate: formatDate(newStartDate),
          endDate: inputDate
        });
      } else {
        // Nếu khoảng thời gian > 7 ngày, cập nhật ngày bắt đầu
        const newStartDate = new Date(endDate);
        newStartDate.setDate(endDate.getDate() - 6); // Lùi 6 ngày để có tổng 7 ngày
        
        setSelectedDayRange({
          startDate: formatDate(newStartDate),
          endDate: inputDate
        });
      }
    }
  };
  // Hàm xử lý khi chọn tháng từ dropdown
  const handleMonthSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowMonthDropdown(false);
    
    // Cập nhật ngày bắt đầu và kết thúc để khớp với tháng đã chọn
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const endDate = new Date(year, month - 1, 7); // 7 ngày đầu tiên của tháng
    
    setSelectedDayRange({
      startDate: formatDate(firstDayOfMonth),
      endDate: formatDate(endDate)
    });
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = () => {
    // Trong thực tế, ở đây sẽ gọi API để lưu dữ liệu xuống database
    try {
      // Giả lập gọi API thành công
      setTimeout(() => {
        setOriginalGrid(JSON.parse(JSON.stringify(availabilityGrid)));
        setHasChanges(false);
        
        // Hiển thị thông báo thành công
        alert('Đã lưu lịch rảnh thành công!');
      }, 500);
    } catch (error) {
      console.error('Lỗi khi lưu lịch rảnh:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!');
    }
  };

  // Hàm xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    // Khôi phục trạng thái ban đầu
    setAvailabilityGrid(JSON.parse(JSON.stringify(originalGrid)));
    setHasChanges(false);
    alert('Đã hủy các thay đổi!');
  };

  // Các hàm xử lý điều hướng
  const handleSettings = () => {
    alert('Tính năng cài đặt nhóm đang được phát triển');
  };
  // Chỉ để tham chiếu cho việc chuyển đến trang sự kiện khi cần
  const handleBack = () => {
    navigate(`/groups/${groupId}/event-manager`);
  };

  // Các nút chức năng bên phải
  const rightButtons = [
    { label: 'Chỉnh sửa thời gian', onClick: () => {} },
    { label: 'Chỉnh sửa vị trí và sở thích', onClick: () => navigate(`/groups/${groupId}/location-preference`) },
    { label: 'Xem lịch rảnh chung của cả nhóm', onClick: () => navigate(`/groups/${groupId}/group-calendar`) },
    { label: 'Xem danh sách các đề xuất', onClick: () => navigate(`/groups/${groupId}/suggestion-list`) },
    { label: 'Xem sự kiện', onClick: () => navigate(`/groups/${groupId}/event-manager`) },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header - luôn trở về trang danh sách nhóm */}
      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        onSettings={handleSettings}
        showBackToGroups={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">            {/* Dropdown Tháng */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="border rounded-md p-2 cursor-pointer flex items-center justify-between bg-white hover:bg-gray-50"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              >
                <span>Tháng {selectedMonth} - {selectedYear}</span>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              {showMonthDropdown && (
                <div className="absolute left-0 right-0 mt-1 border rounded-md bg-white z-10 shadow-lg max-h-48 overflow-y-auto">
                  {generateMonthOptions().map(month => (
                    <div 
                      key={`${month.year}-${month.value}`} 
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedMonth === month.value && selectedYear === month.year ? 'bg-gray-200' : ''}`}
                      onClick={() => handleMonthSelect(month.value, month.year)}
                    >
                      {month.label}
                    </div>
                  ))}
                </div>
              )}
            </div>            {/* Ngày bắt đầu */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md bg-white"
                value={selectedDayRange.startDate}
                onChange={handleStartDateChange}
                min={formatDate(new Date())} // Không cho chọn ngày trong quá khứ
              />
            </div>{/* Nút Lưu */}
            <div className="flex items-end">
              <button 
                className={`w-full text-center py-2 px-4 rounded-md transition-colors ${
                  hasChanges 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-purple-300 hover:bg-purple-400'
                }`}
                onClick={handleSave}
                disabled={!hasChanges}
              >
                {hasChanges ? 'Lưu thay đổi' : 'Đã lưu'}
              </button>
            </div>

            {/* Ngày kết thúc */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md bg-white"
                value={selectedDayRange.endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {/* Nút Hủy */}
            <div className="flex items-end">
              <button 
                className={`w-full text-center py-2 px-4 rounded-md transition-colors ${
                  hasChanges 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleCancel}
                disabled={!hasChanges}
              >
                Hủy thay đổi
              </button>
            </div>
          </div>          {/* Chú thích */}
          <div className="flex items-center mb-4 gap-6 pl-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm">Có thể tham gia</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm mr-2"></div>
              <span className="text-sm">Không thể tham gia</span>
            </div>
            <div className="text-sm text-gray-500">
              (Nhấp vào ô để đổi trạng thái)
            </div>
          </div>
        
          {/* Bảng lịch */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border p-2 text-center w-20">Giờ</th>
                  <th className="border p-2 text-center">Thứ 2</th>
                  <th className="border p-2 text-center">Thứ 3</th>
                  <th className="border p-2 text-center">Thứ 4</th>
                  <th className="border p-2 text-center">Thứ 5</th>
                  <th className="border p-2 text-center">Thứ 6</th>
                  <th className="border p-2 text-center">Thứ 7</th>
                  <th className="border p-2 text-center">CN</th>
                </tr>
              </thead>
              <tbody>
                {hoursArray.map(hour => (
                  <tr key={hour} className={hour % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border p-2 text-center font-medium">{hour}:00</td>
                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map(day => (
                      <td 
                        key={`${day}-${hour}`} 
                        className={`border p-2 cursor-pointer transition-all ${
                          availabilityGrid[day] && availabilityGrid[day][hour] 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleCellAvailability(day, hour)}
                        title={`${day}, ${hour}:00 - ${availabilityGrid[day] && availabilityGrid[day][hour] ? 'Có thể tham gia' : 'Không thể tham gia'}`}
                      >
                        {availabilityGrid[day] && availabilityGrid[day][hour] ? 
                          <div className="flex justify-center items-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          : ''
                        }
                      </td>
                    ))}
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

export default TimeEditor;
