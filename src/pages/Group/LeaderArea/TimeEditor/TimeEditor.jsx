import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupHeader from '../../../../components/layoutPrimitives/GroupHeader';
import LeaderLayout from '../../../../components/layoutPrimitives/LeaderLayout';
import ChooseMonthAndYear from '../../../../components/groupWidgets/TimeManager/ChooseMonthAndYear';
import ChoosePeriod from '../../../../components/groupWidgets/TimeManager/ChoosePeriod';
import ChooseFreeTime from '../../../../components/groupWidgets/TimeManager/ChooseFreeTime';
import { getGroupById } from '../../../../services/groupService';
import { Dialog } from '../../../../components/common/Dialog';

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
  defaultEndDate.setDate(today.getDate() + 6);
  
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDayRange, setSelectedDayRange] = useState({
    startDate: today,
    endDate: defaultEndDate
  });
  
  const [availabilityGrid, setAvailabilityGrid] = useState({});
  const [originalGrid, setOriginalGrid] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
          // Sẽ xử lý thông báo lỗi bằng Dialog trong bản cập nhật tiếp theo
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin nhóm:', error);
        // Sẽ xử lý thông báo lỗi bằng Dialog trong bản cập nhật tiếp theo
      }
    };

    fetchGroupData();
  }, [groupId]);
  
  // Xử lý khi chọn tháng và năm từ dropdown
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Xử lý khi khoảng ngày thay đổi từ ChoosePeriod component
  const handlePeriodChange = (newDateRange) => {
    setSelectedDayRange(newDateRange);
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSave = (updatedGrid) => {
    try {
      // Giả lập gọi API thành công
      setTimeout(() => {
        setOriginalGrid(JSON.parse(JSON.stringify(updatedGrid)));
        setAvailabilityGrid(updatedGrid);
        setHasChanges(false);
        setShowSuccessDialog(true);
      }, 500);
    } catch (error) {
      console.error('Lỗi khi lưu lịch rảnh:', error);
      // Sẽ xử lý thông báo lỗi bằng Dialog trong bản cập nhật tiếp theo
    }
  };

  // Hàm xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    // Hiện dialog xác nhận trước khi hủy
    setShowCancelDialog(true);
  };

  // Xác nhận hủy thay đổi
  const confirmCancel = () => {
    setAvailabilityGrid(JSON.parse(JSON.stringify(originalGrid)));
    setHasChanges(false);
    setShowCancelDialog(false);
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
  
  // Hàm xử lý khi component con thay đổi grid
  const handleGridChange = (newGrid, hasChange) => {
    setAvailabilityGrid(newGrid);
    if (hasChange) {
      setHasChanges(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header - luôn trở về trang danh sách nhóm */}      
      <GroupHeader 
        groupName={groupInfo.name || 'Đang tải...'}
        memberCount={groupInfo.memberCount || 0}
        showBackToGroups={true}
        isLeader={true}
      />
      
      {/* Main Content */}
      <LeaderLayout rightButtons={rightButtons}>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">            
            {/* Dropdown Tháng */}
            <div>
              <ChooseMonthAndYear onMonthYearChange={handleMonthYearChange} />
            </div>
            
            {/* Chọn khoảng thời gian */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Khoảng thời gian</label>
              <ChoosePeriod 
                month={selectedMonth} 
                year={selectedYear} 
                currentWeek={0}
                onPeriodChange={handlePeriodChange}
              />
            </div>
          </div>
          
          {/* Component ChooseFreeTime */}
          <ChooseFreeTime 
            initialGrid={originalGrid} 
            onChange={handleGridChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </LeaderLayout>

      {/* Dialog thành công */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Thành công"
        message="Đã lưu lịch rảnh thành công!"
        type="alert"
      />

      {/* Dialog xác nhận hủy */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn hủy các thay đổi không?"
        type="confirm"
        confirmText="Đồng ý"
        cancelText="Không"
      />
    </div>
  );
};

export default TimeEditor;
