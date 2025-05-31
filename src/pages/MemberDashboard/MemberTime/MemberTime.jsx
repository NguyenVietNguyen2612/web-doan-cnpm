import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDays, updateAvailableDays } from '../../../services/timeService';

const MemberTime = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [originalSelectedDays, setOriginalSelectedDays] = useState([]); 
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [inputMonth, setInputMonth] = useState('');
  const [inputYear, setInputYear] = useState('');
    // Lấy dữ liệu ngày rảnh rỗi từ API
  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        const response = await getAvailableDays();
        if (response.success) {
          setSelectedDays(response.data);
          setOriginalSelectedDays([...response.data]);
        } else {
          console.error('Lỗi khi lấy dữ liệu ngày rảnh rỗi:', response.message);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ngày rảnh rỗi:', error);
      }
    };
    
    fetchAvailableDays();
  }, []);
  // Lưu lại các ngày đã chọn
  const saveAvailableDays = async () => {
    try {
      const response = await updateAvailableDays(selectedDays);
      if (response.success) {
        setOriginalSelectedDays([...selectedDays]);
        alert('Đã lưu lịch rảnh rỗi thành công!');
      } else {
        alert('Không thể lưu lịch: ' + response.message);
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu ngày rảnh rỗi:', error);
      alert('Có lỗi xảy ra khi lưu lịch!');
    }
  };
  
  // Quay lại trạng thái ban đầu
  const cancelChanges = () => {
    setSelectedDays([...originalSelectedDays]);
  };

  // Xử lý khi nhấn vào một ngày
  const handleDayClick = (day) => {
    // Nếu ngày này không thuộc tháng hiện tại, bỏ qua
    if (!day) return;
    
    const dayString = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${day}`;
    
    if (selectedDays.includes(dayString)) {
      setSelectedDays(selectedDays.filter(d => d !== dayString));
    } else {
      setSelectedDays([...selectedDays, dayString]);
    }
  };
  
  // Chuyển sang tháng trước
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  // Chuyển sang tháng sau
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Xử lý khi người dùng thay đổi tháng
  const handleMonthEdit = () => {
    setIsEditingMonth(true);
    setInputMonth((currentDate.getMonth() + 1).toString());
  };
  
  // Xử lý khi người dùng thay đổi năm
  const handleYearEdit = () => {
    setIsEditingYear(true);
    setInputYear(currentDate.getFullYear().toString());
  };
  
  // Xử lý khi người dùng nhập tháng
  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputMonth(value);
    }
  };
  
  // Xử lý khi người dùng nhập năm
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputYear(value);
    }
  };
  
  // Xử lý khi người dùng nhấn Enter để chọn tháng
  const handleMonthKeyDown = (e) => {
    if (e.key === 'Enter') {
      const monthNum = parseInt(inputMonth, 10);
      if (monthNum >= 1 && monthNum <= 12) {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(monthNum - 1);
          return newDate;
        });
        setIsEditingMonth(false);
      }
    } else if (e.key === 'Escape') {
      setIsEditingMonth(false);
    }
  };
  
  // Xử lý khi người dùng nhấn Enter để chọn năm
  const handleYearKeyDown = (e) => {
    if (e.key === 'Enter') {
      const yearNum = parseInt(inputYear, 10);
      if (yearNum >= 1900 && yearNum <= 2100) {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setFullYear(yearNum);
          return newDate;
        });
        setIsEditingYear(false);
      }
    } else if (e.key === 'Escape') {
      setIsEditingYear(false);
    }
  };
  
  // Xử lý khi người dùng click ra ngoài input
  const handleBlur = () => {
    setIsEditingMonth(false);
    setIsEditingYear(false);
  };

  // Tạo mảng các ngày trong tháng hiện tại
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Tính ngày đầu tiên của tháng rơi vào thứ mấy (0 = Chủ Nhật, 1 = Thứ 2, ..., 6 = Thứ 7)
    const firstDayOfMonth = date.getDay();
    
    // Thêm các ô trống cho những ngày trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Tạo lịch
  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  
  // Danh sách các tháng, bắt đầu từ 0 (Tháng 1)
  const months = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
  ];
  
  // Tạo mã định danh cho ngày trong tháng hiện tại
  const getDayId = (day) => {
    if (!day) return '';
    return `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${day}`;
  };
  
  // Kiểm tra xem một ngày có được chọn hay không
  const isDaySelected = (day) => {
    if (!day) return false;
    const dayId = getDayId(day);
    return selectedDays.includes(dayId);
  };
  return (
    <div className="flex flex-col h-screen bg-white overflow-auto">
      <div className="flex flex-col items-center w-full h-full px-4 md:px-8 py-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Lịch cá nhân và đánh dấu thời gian rảnh</h1>
        
        {/* Calendar container */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Calendar navigation */}
          <div className="flex justify-center items-center p-4 border-b">
            <button 
              onClick={goToPreviousMonth}
              className="text-primary hover:text-primary-dark px-3"
            >
              ← tháng {currentDate.getMonth()}
            </button>
            
            <div className="flex-1 text-center font-medium text-lg">
              {isEditingMonth ? (
                <input
                  type="text"
                  value={inputMonth}
                  onChange={handleMonthChange}
                  onKeyDown={handleMonthKeyDown}
                  onBlur={handleBlur}
                  className="w-16 text-center border-b border-primary outline-none mx-2"
                  autoFocus
                />
              ) : (
                <span onClick={handleMonthEdit} className="cursor-pointer hover:text-primary">
                  tháng {currentDate.getMonth() + 1}
                </span>
              )}
              
              {isEditingYear ? (
                <input
                  type="text"
                  value={inputYear}
                  onChange={handleYearChange}
                  onKeyDown={handleYearKeyDown}
                  onBlur={handleBlur}
                  className="w-20 text-center border-b border-primary outline-none mx-2"
                  autoFocus
                />
              ) : (
                <span onClick={handleYearEdit} className="cursor-pointer hover:text-primary ml-2">
                  {currentDate.getFullYear()}
                </span>
              )}
            </div>
            
            <button 
              onClick={goToNextMonth}
              className="text-primary hover:text-primary-dark px-3"
            >
              tháng {(currentDate.getMonth() + 2) > 12 ? 1 : (currentDate.getMonth() + 2)} →
            </button>
          </div>
          
          {/* Calendar header */}
          <div className="grid grid-cols-7 text-center py-2 border-b">
            <div className="text-sm font-medium">T2</div>
            <div className="text-sm font-medium">T3</div>
            <div className="text-sm font-medium">T4</div>
            <div className="text-sm font-medium">T5</div>
            <div className="text-sm font-medium">T6</div>
            <div className="text-sm font-medium">T7</div>
            <div className="text-sm font-medium">CN</div>
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 text-center">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  py-3 border-b border-r 
                  ${index % 7 === 6 ? 'border-r-0' : ''} 
                  ${day ? 'cursor-pointer hover:bg-gray-50' : ''}
                  ${isDaySelected(day) ? 'bg-primary text-white hover:bg-primary-dark' : ''}
                `}
                onClick={() => handleDayClick(day)}
              >
                {day}
                {day === 14 && <div className="text-xs mt-1 text-blue-600">•</div>}
                {day === 15 && <div className="text-xs mt-1 text-blue-600">•</div>}
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={cancelChanges}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={saveAvailableDays}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            Đánh dấu rảnh rỗi
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberTime;
