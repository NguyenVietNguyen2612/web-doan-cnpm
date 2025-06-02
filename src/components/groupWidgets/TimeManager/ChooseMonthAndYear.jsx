import React, { useState, useRef, useEffect } from 'react';

const ChooseMonthAndYear = ({ onMonthYearChange }) => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Tạo danh sách dropdown các tháng (bắt đầu từ tháng hiện tại và 6 tháng tiếp theo)
  const generateMonthOptions = () => {
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

  // Xử lý khi chọn tháng từ dropdown
  const handleMonthSelect = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setShowDropdown(false);
    
    if (onMonthYearChange) {
      onMonthYearChange(month, year);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="border rounded-md p-2 cursor-pointer flex items-center justify-between bg-white hover:bg-gray-50"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>Tháng {selectedMonth} - {selectedYear}</span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {showDropdown && (
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
    </div>
  );
};

export default ChooseMonthAndYear;