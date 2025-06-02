import React, { useState, useEffect } from 'react';
import { HiUsers, HiDocumentText, HiUserGroup, HiOfficeBuilding, HiExclamationCircle } from 'react-icons/hi';

// Mocked data for demonstration
// In a real application, this would come from API calls
const mockData = {
  userStats: {
    total: 1250,
    active: 980,
    newToday: 25,
    newThisWeek: 87
  },
  postStats: {
    total: 458,
    pending: 32,
    approved: 402,
    rejected: 24
  },
  groupStats: {
    total: 95,
    active: 82,
    newThisWeek: 8
  },
  enterpriseStats: {
    total: 54,
    active: 48,
    premium: 22
  },
  recentReports: [
    { id: 1, type: 'post', title: 'Nội dung không phù hợp', status: 'pending', date: '2025-06-01' },
    { id: 2, type: 'user', title: 'Người dùng spam', status: 'resolved', date: '2025-05-30' },
    { id: 3, type: 'group', title: 'Vi phạm điều khoản', status: 'pending', date: '2025-05-29' },
    { id: 4, type: 'enterprise', title: 'Thông tin sai lệch', status: 'investigating', date: '2025-05-28' }
  ]
};

// Stat Card Component
const StatCard = ({ icon, title, stats, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${iconColor} text-white mr-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-sm text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span className="text-xl font-bold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Report Item Component
const ReportItem = ({ report }) => {
  const getStatusColor = () => {
    switch (report.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = () => {
    switch (report.type) {
      case 'post': return <HiDocumentText className="h-5 w-5" />;
      case 'user': return <HiUsers className="h-5 w-5" />;
      case 'group': return <HiUserGroup className="h-5 w-5" />;
      case 'enterprise': return <HiOfficeBuilding className="h-5 w-5" />;
      default: return <HiExclamationCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-gray-100 p-2 rounded-lg mr-3">
          {getTypeIcon()}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{report.title}</h4>
          <p className="text-xs text-gray-500">Báo cáo ngày {new Date(report.date).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusColor()}`}>
          {report.status}
        </span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(mockData);
  
  // In a real application, we would fetch data here
  useEffect(() => {
    // Example API call
    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await fetch('/api/admin/dashboard');
    //     const data = await response.json();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // };
    // 
    // fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-6">
      {/* Header area */}
      <div className="bg-white shadow-sm p-4 rounded-lg border-b mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Trang quản trị</h1>
        <p className="text-sm text-gray-600">Thống kê và quản lý toàn hệ thống</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          icon={<HiUsers className="h-6 w-6" />} 
          title="Người dùng" 
          stats={stats.userStats} 
          iconColor="bg-blue-500"
        />
        <StatCard 
          icon={<HiDocumentText className="h-6 w-6" />} 
          title="Bài đăng" 
          stats={stats.postStats} 
          iconColor="bg-amber-500"
        />
        <StatCard 
          icon={<HiUserGroup className="h-6 w-6" />} 
          title="Nhóm" 
          stats={stats.groupStats} 
          iconColor="bg-green-500"
        />
        <StatCard 
          icon={<HiOfficeBuilding className="h-6 w-6" />} 
          title="Doanh nghiệp" 
          stats={stats.enterpriseStats} 
          iconColor="bg-purple-500"
        />
      </div>
      
      {/* Recent reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Báo cáo gần đây</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">Xem tất cả</button>
        </div>
        
        <div className="space-y-4">
          {stats.recentReports.map(report => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      </div>
      
      {/* Quick links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center justify-center">
          <HiExclamationCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-gray-800">Xử lý báo cáo</span>
        </button>
        <button className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center justify-center">
          <HiDocumentText className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-gray-800">Duyệt bài đăng mới</span>
        </button>
        <button className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center justify-center">
          <HiUsers className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-800">Quản lý người dùng</span>
        </button>
        <button className="bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center justify-center">
          <HiOfficeBuilding className="h-5 w-5 text-purple-500 mr-2" />
          <span className="text-gray-800">Thêm doanh nghiệp mới</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;