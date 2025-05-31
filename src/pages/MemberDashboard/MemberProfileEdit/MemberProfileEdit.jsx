import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../../assets/images/UserFace.png';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../../services/profileService';

const MemberProfileEdit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDataForm, setUserDataForm] = useState({
    name: '',
    phone: '',
    email: '',
    avatar: null,
    avatarPreview: defaultAvatar
  });

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        
        if (response.success) {
          setUserDataForm({
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            avatar: null,
            avatarPreview: response.data.avatar || defaultAvatar
          });
        } else {
          alert('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        alert('Đã xảy ra lỗi khi tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDataForm(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDataForm(prevData => ({
          ...prevData,
          avatar: file,
          avatarPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Đầu tiên, cập nhật thông tin cơ bản
      const profileData = {
        name: userDataForm.name,
        phone: userDataForm.phone,
        email: userDataForm.email,
      };
      
      const updateResponse = await updateUserProfile(profileData);
      
      // Nếu có avatar mới, tải lên riêng
      if (userDataForm.avatar) {
        const avatarResponse = await uploadAvatar(userDataForm.avatar);
        if (!avatarResponse.success) {
          console.error("Lỗi khi tải avatar:", avatarResponse.message);
        }
      }
      
      if (updateResponse.success) {
        // Thành công - chuyển về trang profile
        alert('Cập nhật thông tin thành công!');
        navigate('/profile');
      } else {
        alert('Không thể cập nhật thông tin: ' + updateResponse.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    // Reset form về trạng thái ban đầu bằng cách lấy lại dữ liệu từ API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        
        if (response.success) {
          setUserDataForm({
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
            avatar: null,
            avatarPreview: response.data.avatar || defaultAvatar
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  };
  
  return (
    <div className="flex flex-col h-screen bg-white overflow-auto">
      <div className="flex flex-col items-center w-full h-full px-4 md:px-8 py-6">        {/* Header with title */}
        <div className="flex justify-between w-full max-w-3xl mb-6">
          <h2 className="text-xl font-medium">Chỉnh sửa thông tin cá nhân</h2>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            onClick={() => navigate('/profile')}
          >
            Trở về
          </button>
        </div>

        {/* Main form container */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-3xl w-full">
          {/* Profile avatar and upload */}
          <div className="mb-8 text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md relative">
              <img 
                src={userDataForm.avatarPreview} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden"
              />
            </div>
            <h2 className="text-xl md:text-2xl font-medium text-center">
              {userDataForm.name || "Username"}
            </h2>
          </div>
          
          {/* Form fields */}
          <div className="bg-lavender-100 rounded-lg p-6 md:p-8 w-full max-w-md shadow-sm">
            <div className="space-y-5">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-500 text-sm mb-1">Họ tên</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={userDataForm.name}
                  onChange={handleInputChange}
                  className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-500 text-sm mb-1">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userDataForm.phone}
                  onChange={handleInputChange}
                  className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-500 text-sm mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userDataForm.email}
                  onChange={handleInputChange}
                  className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                  required
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-primary text-white border border-primary rounded-md hover:bg-primary-dark transition-colors text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberProfileEdit;
