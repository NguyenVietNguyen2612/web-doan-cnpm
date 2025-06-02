import React, { useState, useEffect } from 'react';

const EnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Placeholder for fetching enterprise profile
  useEffect(() => {
    // In a real application, you would fetch profile from an API
    // For now, we'll use mock data
    const mockProfile = {
      id: 1,
      name: 'Cafe Sáng Tạo',
      logo: 'https://via.placeholder.com/150',
      coverImage: 'https://via.placeholder.com/1200x300',
      description: 'Không gian làm việc và học tập sáng tạo, dành cho nhóm và cá nhân',
      address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      phone: '0912345678',
      email: 'info@cafesangtao.com',
      website: 'cafesangtao.com',
      openingHours: '07:00 - 22:00',
      capacity: '50 người',
      facilities: ['Wifi', 'Điều hòa', 'Phòng họp riêng', 'Máy chiếu', 'Bàn ghế nhóm']
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 500);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real application, you would save changes to an API
    setIsEditing(false);
    // Show success notification
    alert('Cập nhật thông tin thành công!');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50 items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header area */}
      <div className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">Hồ sơ doanh nghiệp</h1>
        <p className="text-sm text-gray-600">Xem và quản lý thông tin doanh nghiệp</p>
      </div>
      
      {/* Profile content */}
      <div className="flex-1 p-4">
        {/* Cover image and logo */}
        <div className="relative mb-4">
          <div className="h-48 w-full rounded-lg overflow-hidden">
            <img 
              src={profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2 bg-white p-1 rounded-full border-4 border-white shadow-lg">
            <img 
              src={profile.logo} 
              alt="Logo" 
              className="w-24 h-24 rounded-full object-cover" 
            />
          </div>
        </div>

        {/* Profile details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-14">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Chỉnh sửa thông tin
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Lưu thay đổi
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Mô tả</h3>
                {isEditing ? (
                  <textarea 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    rows={4}
                    defaultValue={profile.description}
                  />
                ) : (
                  <p className="text-gray-700">{profile.description}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Địa chỉ</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.address}
                  />
                ) : (
                  <p className="text-gray-700">{profile.address}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Số điện thoại</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.phone}
                  />
                ) : (
                  <p className="text-gray-700">{profile.phone}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Email</h3>
                {isEditing ? (
                  <input 
                    type="email" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.email}
                  />
                ) : (
                  <p className="text-gray-700">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Website</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.website}
                  />
                ) : (
                  <p className="text-gray-700">{profile.website}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Giờ mở cửa</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.openingHours}
                  />
                ) : (
                  <p className="text-gray-700">{profile.openingHours}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Sức chứa</h3>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue={profile.capacity}
                  />
                ) : (
                  <p className="text-gray-700">{profile.capacity}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase font-medium">Tiện nghi</h3>
                {isEditing ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {profile.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span>{facility}</span>
                        <button className="ml-1 text-gray-500 hover:text-red-500">×</button>
                      </div>
                    ))}
                    <button className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-300">
                      + Thêm
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.facilities.map((facility, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseProfile;
