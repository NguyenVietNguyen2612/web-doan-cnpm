// filepath: e:\web-doan-third\web-doan-cnpm\src\pages\Auth\Login\Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import Input from '../../../components/common/Input';
import { RoundButton } from '../../../components/common/Button';
import authService from '../../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xác thực form
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập tên người dùng';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (response.success) {
        // Thông tin người dùng và token đã được lưu trong authService.login
        const user = authService.getCurrentUser();
        
        // Chuyển hướng dựa vào role
        if (user.role === 'Member') {
          navigate('/dashboard');
        } else if (user.role === 'Admin') {
          navigate('/admin');
        } else if (user.role === 'Enterprise') {
          navigate('/enterprise');
        }
      } else {
        setErrors({
          password: response.message
        });
      }
    } catch (error) {
      setErrors({
        password: error.message || 'Đăng nhập thất bại'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Logo ở góc trên bên trái */}
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Logo size="default" />
        </Link>
      </div>{/* Form đăng nhập */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">ĐĂNG NHẬP</h1>
          
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
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                error={errors.password}
              />
            </div>            <div className="flex justify-end mb-4">
              <Link to="/forgot-password" className="text-primary hover:underline text-sm">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="mb-6 flex justify-center">
              <RoundButton 
                type="submit" 
                variant="primary-light" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </RoundButton>
            </div>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;