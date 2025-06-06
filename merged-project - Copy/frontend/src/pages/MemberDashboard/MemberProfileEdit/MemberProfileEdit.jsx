import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../../assets/images/UserFace.png';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../../services/profileService';

const MemberProfileEdit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
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
            name: response.data.name || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            avatar: null,
            avatarPreview: response.data.avatar || defaultAvatar
          });
        } else {
          alert(response.message || 'Không thể tải thông tin người dùng');
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

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Họ tên không được để trống';
    if (name.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
    if (name.trim().length > 50) return 'Họ tên không được quá 50 ký tự';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Số điện thoại không được để trống';
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.trim())) return 'Số điện thoại phải có 10-11 chữ số';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email không được để trống';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Email không đúng định dạng';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật giá trị
    setUserDataForm(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Validate real-time
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      default:
        break;
    }

    // Cập nhật errors
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

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

  const validateForm = () => {
    const newErrors = {
      name: validateName(userDataForm.name),
      phone: validatePhone(userDataForm.phone),
      email: validateEmail(userDataForm.email)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const profileData = {
        name: userDataForm.name.trim(),
        phone: userDataForm.phone.trim(),
        email: userDataForm.email.trim().toLowerCase(),
      };
      
      const updateResponse = await updateUserProfile(profileData);
      
      if (updateResponse.success) {
        // Nếu có avatar mới, tải lên riêng
        if (userDataForm.avatar) {
          try {
            await uploadAvatar(userDataForm.avatar);
          } catch (avatarError) {
            console.error("Lỗi khi tải avatar:", avatarError);
            // Không block quá trình cập nhật profile nếu upload avatar thất bại
          }
        }
        
        alert('Cập nhật thông tin thành công!');
        navigate('/profile');
      } else {
        alert(updateResponse.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-white overflow-auto">
      <div className="flex flex-col items-center w-full h-full px-4 md:px-8 py-6">
        {/* Header with title */}
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
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                title="Thay đổi ảnh đại diện"
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
                <label htmlFor="name" className="text-gray-500 text-sm mb-1">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={userDataForm.name}
                  onChange={handleInputChange}
                  className={`p-3 rounded-md border focus:outline-none focus:ring-1 bg-white ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Nhập họ tên của bạn"
                  required
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-gray-500 text-sm mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userDataForm.phone}
                  onChange={handleInputChange}
                  className={`p-3 rounded-md border focus:outline-none focus:ring-1 bg-white ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="0123456789"
                  required
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-500 text-sm mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userDataForm.email}
                  onChange={handleInputChange}
                  className={`p-3 rounded-md border focus:outline-none focus:ring-1 bg-white ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="example@email.com"
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">{errors.email}</span>
                )}
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
                  className="px-8 py-2 bg-primary text-white border border-primary rounded-md hover:bg-primary-dark transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
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
