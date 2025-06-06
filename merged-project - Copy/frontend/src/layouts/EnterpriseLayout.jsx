// filepath: e:\web-doan-third\web-doan-cnpm\src\layouts\EnterpriseLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const EnterpriseLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();  const navigationItems = [
    {
      path: '/enterprise/dashboard',
      label: 'Xem bài đăng',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
        </svg>
      )
    },
    {
      path: '/enterprise/posts',
      label: 'Quản lý bài viết',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      path: '/enterprise/profile',
      label: 'Hồ sơ cá nhân',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      path: '/enterprise/booking',
      label: 'Quản lý đặt chỗ',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div 
        className={`bg-primary-light text-black transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="p-4 flex items-center justify-center">
            <Logo size={sidebarOpen ? "default" : "small"} />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 pt-6">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 mx-4 rounded-lg transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-white/20 text-black' 
                    : 'text-black/80 hover:bg-white/10 hover:text-black'
                  }`}
              >
                <div className="min-w-[24px]">{item.icon}</div>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Toggle button */}
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 text-black/80 hover:text-black hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default EnterpriseLayout;