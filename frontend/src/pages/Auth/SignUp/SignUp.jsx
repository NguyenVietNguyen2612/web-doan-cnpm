// filepath: e:\web-doan-third\web-doan-cnpm\src\pages\Auth\SignUp\SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import Input from '../../../components/common/Input';
import { RoundButton } from '../../../components/common/Button';
import GoogleSignUpButton from '../../../components/common/GoogleSignUpButton';
import { authService } from '../../../services/authService';
import { validateUsername, validateEmail, validatePhone, validatePassword } from '../../../utils/validation';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra tên người dùng với validation mới
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    
    // Kiểm tra email với validation mới
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Kiểm tra số điện thoại với validation mới
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // Kiểm tra mật khẩu với validation mới
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Gửi dữ liệu lên server
      const registerData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        full_name: formData.username, // Assuming username as full_name
        role: 'Member'
      };

      console.log('📤 Sending register data:', registerData);
      const response = await authService.register(registerData);
      console.log('✅ Register response:', response);
      
      // Hiển thị thông báo thành công
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
    } catch (error) {
      setErrors({
        submit: error.message
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Logo ở góc trên bên trái - chỉ hiển thị trên desktop */}
      <div className="absolute top-8 left-8 hidden md:block">
        <Link to="/">
          <Logo size="default" />
        </Link>
      </div>
      
      {/* Form đăng ký */}
      <div className="flex-grow flex items-center justify-center px-4 py-8 md:py-0 md:px-0">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-gray-100 w-full max-w-md backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6">ĐĂNG KÝ</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">Tên người dùng</label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên người dùng của bạn"
                error={errors.username}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                error={errors.email}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">Số điện thoại</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại của bạn"
                error={errors.phone}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">Mật khẩu</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tạo mật khẩu mới"
                error={errors.password}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">Xác nhận mật khẩu</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu xác nhận"
                error={errors.confirmPassword}
              />
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {errors.submit}
              </div>
            )}

            <div className="mb-6 flex justify-center">
              <RoundButton 
                type="submit" 
                variant="primary-light" 
                size="lg"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </RoundButton>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-xs md:text-sm">hoặc</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google SignUp Button */}
          <div className="mb-6">
            <GoogleSignUpButton onLoading={setLoading} />
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary hover:underline hover:text-primary-dark hover:scale-105 hover:drop-shadow-sm transition-all duration-200 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;