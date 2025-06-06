// filepath: e:\web-doan-third\web-doan-cnpm\src\pages\Auth\Login\Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import Input from '../../../components/common/Input';
import { RoundButton } from '../../../components/common/Button';
import { authService } from '../../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors khi user đang typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const handleSubmit = async (e) => {
    try {
      console.log('🚀 handleSubmit called', { 
        eventType: e?.type || 'click',
        target: e?.target?.tagName,
        form: e?.target?.form
      });
      if (e && e.preventDefault) {
        e.preventDefault();
        console.log('✅ preventDefault called');
      }
      
      // Prevent multiple submits
      if (loading) {
        console.log('🛑 Already loading, skipping');
        return false;
      }
      
      // Clear previous errors
      setErrors({});
      
      // Xác thực form
      const newErrors = {};
      if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên người dùng';
      if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';

      if (Object.keys(newErrors).length > 0) {
        console.log('❌ Validation errors:', newErrors);
        setErrors(newErrors);
        return false;
      }

      setLoading(true);
      console.log('⏳ Loading set to true');
      
      try {
        console.log('🚀 Calling authService.login with:', formData);
        const response = await authService.login(formData);
        console.log('✅ Login success:', response);
        
        // Chuyển hướng dựa vào role
        if (response.user.role === 'Member') {
          navigate('/dashboard');
        } else if (response.user.role === 'Admin') {
          navigate('/admin');
        } else if (response.user.role === 'Enterprise') {
          navigate('/enterprise');
        } else {
          navigate('/dashboard'); // Default
        }
      } catch (error) {
        console.error('❌ Login API error:', {
          message: error.message,
          stack: error.stack,
          error: error
        });
        
        setErrors({
          password: error.message || 'Đăng nhập thất bại'
        });
        
        console.log('🛑 Setting error state, preventing navigation');
      } finally {
        setLoading(false);
        console.log('🏁 Loading state set to false');
      }
      
    } catch (globalError) {
      console.error('💥 Global error in handleSubmit:', globalError);
      setErrors({
        password: 'Đã xảy ra lỗi không mong muốn'
      });
      setLoading(false);
    }
    
    // Prevent any default behavior
    return false;
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
          
          <form onSubmit={(e) => e.preventDefault()}>
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
            </div>

            {(errors.username || errors.password) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.username || errors.password}
              </div>
            )}

            <div className="flex justify-end mb-4">
              <Link to="/forgot-password" className="text-primary hover:underline text-sm">
                Quên mật khẩu?
              </Link>
            </div>

            <div className="mb-6 flex justify-center">
              <RoundButton 
                type="button"
                variant="primary-light" 
                size="lg"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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