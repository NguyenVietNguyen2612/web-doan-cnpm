// filepath: e:\web-doan-third\web-doan-cnpm\src\pages\Auth\SignUp\SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import Input from '../../../components/common/Input';
import { RoundButton } from '../../../components/common/Button';
import { authService } from '../../../services/authService';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra tên người dùng
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên người dùng';
    }
    
    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Kiểm tra số điện thoại
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Logo ở góc trên bên trái */}
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Logo size="default" />
        </Link>
      </div>
      
      {/* Form đăng ký */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">ĐĂNG KÝ</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên người dùng</label>
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
              <label className="block text-gray-700 mb-2">Email</label>
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
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
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
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
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
              <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
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
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.submit}
              </div>
            )}

            <div className="mb-6 flex justify-center">
              <RoundButton 
                type="submit" 
                variant="primary-light" 
                size="lg"
              >
                Đăng ký
              </RoundButton>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary hover:underline">
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