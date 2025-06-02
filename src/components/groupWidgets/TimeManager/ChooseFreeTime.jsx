import React, { useState, useEffect, useMemo } from 'react';

// Tạo mảng giờ từ 7h sáng đến 22h tối
const hoursArray = Array.from({ length: 16 }, (_, i) => 7 + i);
const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

const ChooseFreeTime = ({ initialGrid, onChange, onSave, onCancel }) => {
  const [availabilityGrid, setAvailabilityGrid] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Khởi tạo grid khi component mount hoặc initialGrid thay đổi
  useEffect(() => {
    if (initialGrid && Object.keys(initialGrid).length > 0) {
      setAvailabilityGrid(JSON.parse(JSON.stringify(initialGrid)));
    }
  }, [initialGrid]);

  // Xử lý thay đổi trạng thái ô
  const toggleCellAvailability = (day, hour) => {
    setAvailabilityGrid(prevGrid => {
      const newGrid = {...prevGrid};
      newGrid[day] = {...newGrid[day]};
      newGrid[day][hour] = !newGrid[day][hour];
      setHasChanges(true);
      
      // Thông báo thay đổi lên component cha
      if (onChange) {
        onChange(newGrid, true);
      }
      
      return newGrid;
    });
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = () => {
    if (onSave) {
      onSave(availabilityGrid);
      setHasChanges(false);
    }
  };

  // Hàm xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      setHasChanges(false);
    }
  };
  
  // Sử dụng useMemo để tối ưu hóa hiệu suất rendering
  const availabilityTable = useMemo(() => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-purple-100">
            <th className="border p-2 text-center w-20">Giờ</th>
            {daysOfWeek.map(day => (
              <th key={day} className="border p-2 text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hoursArray.map(hour => (
            <tr key={hour} className={hour % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="border p-2 text-center font-medium">{hour}:00</td>
              {daysOfWeek.map(day => (
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
  ), [availabilityGrid]);

  return (
    <div className="bg-white rounded-md">
      {/* Chú thích */}
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
      {availabilityTable}
      
      {/* Nút Lưu và Hủy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <button 
          className={`text-center py-2 px-4 rounded-md transition-colors ${
            hasChanges 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-purple-300 hover:bg-purple-400'
          }`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          {hasChanges ? 'Lưu thay đổi' : 'Đã lưu'}
        </button>
        
        <button 
          className={`text-center py-2 px-4 rounded-md transition-colors ${
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
    </div>
  );
};

export default ChooseFreeTime;