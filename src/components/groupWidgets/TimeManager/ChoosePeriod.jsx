// filepath: e:\web-doan-third\web-doan-cnpm\src\components\groupWidgets\TimeManager\ChoosePeriod.jsx
import React, { useState, useEffect } from 'react';

const ChoosePeriod = ({ month, year, currentWeek = 0, onPeriodChange }) => {
  // State cho khoảng ngày hiển thị
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  
  // State cho tuần hiện tại
  const [weekOffset, setWeekOffset] = useState(currentWeek);
  
  // Hàm định dạng ngày theo format dd/MM/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm tính toán ngày bắt đầu và kết thúc dựa trên tuần hiện tại của tháng đã chọn
  const calculateDateRange = (month, year, weekOffset = 0) => {
    // Tạo ngày đầu tiên của tháng đã chọn
    const firstDayOfMonth = new Date(year, month - 1, 1);
    
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

  // Tính lại khoảng ngày khi tháng, năm hoặc tuần thay đổi
  useEffect(() => {
    const newDateRange = calculateDateRange(month, year, weekOffset);
    setDateRange(newDateRange);
    
    if (onPeriodChange) {
      onPeriodChange(newDateRange);
    }
  }, [month, year, weekOffset, onPeriodChange]);

  // Hàm xử lý khi chọn tuần trước đó
  const handlePreviousWeek = () => {
    if (weekOffset > 0) {
      const newWeek = weekOffset - 1;
      setWeekOffset(newWeek);
    }
  };
  
  // Hàm xử lý khi chọn tuần tiếp theo
  const handleNextWeek = () => {
    // Giả sử tối đa 5 tuần trong một tháng
    if (weekOffset < 4) {
      const newWeek = weekOffset + 1;
      setWeekOffset(newWeek);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={handlePreviousWeek}
        disabled={weekOffset === 0}
        className={`p-1 rounded ${weekOffset === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
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
        disabled={weekOffset >= 4}
        className={`p-1 rounded ${weekOffset >= 4 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ChoosePeriod;