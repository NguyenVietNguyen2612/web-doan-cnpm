import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../../assets/images/UserFace.png';
import { getUserProfile } from '../../../services/profileService';
import { useDialog } from '../../../components/common';

const MemberProfile = () => {
  const navigate = useNavigate();
  const { showDialog, DialogComponent } = useDialog();
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '', 
    avatar: defaultAvatar
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy dữ liệu từ API mỗi khi component được mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserProfile();
        
        if (response.success) {
          setUserData({
            name: response.data.name || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            avatar: response.data.avatar || defaultAvatar
          });
        } else {
          setError(response.message || 'Không thể tải thông tin người dùng');
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        setError('Đã xảy ra lỗi khi tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    showDialog({
      type: 'confirm',
      title: 'Xác nhận đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất không?',
      onConfirm: () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Chuyển về trang login
        navigate('/login');
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-auto">
      <div className="flex flex-col items-center w-full h-full px-4 md:px-8 py-6">
        {/* Header with buttons */}
        <div className="flex justify-end w-full max-w-3xl mb-6">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md mr-2 hover:bg-gray-50 transition-colors text-sm"
            onClick={() => navigate('/profile/edit')}
          >
            Chỉnh sửa
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>

        {/* Main profile container */}
        <div className="flex flex-col items-center max-w-3xl w-full">
          {/* Profile avatar and name */}
          <div className="mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md">
              <img 
                src={userData.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }} 
              />
            </div>
            <h2 className="text-xl md:text-2xl font-medium text-center">
              {userData.name || 'Chưa cập nhật tên'}
            </h2>
          </div>
          
          {/* User info card */}
          <div className="bg-lavender-100 rounded-lg p-6 md:p-8 w-full max-w-md shadow-sm">
            <h3 className="text-lg font-medium border-b border-lavender-200 pb-2 mb-4">Thông tin cá nhân</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Họ tên</span>
                <span className="text-gray-800">{userData.name || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Số điện thoại</span>
                <span className="text-gray-800">{userData.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Email</span>
                <span className="text-gray-800">{userData.email || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent />
    </div>
  );
};

export default MemberProfile;
