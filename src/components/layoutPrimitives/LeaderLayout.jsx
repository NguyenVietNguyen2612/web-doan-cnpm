import React from 'react';

/**
 * Layout cho trang quản lý nhóm dành cho nhóm trưởng
 * Hiển thị các nút chức năng bên phải và phần nội dung chính bên trái
 */
const LeaderLayout = ({ children, rightButtons }) => {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Phần nội dung chính */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
      
      {/* Các nút chức năng bên phải */}
      <div className="w-full md:w-64 py-4 px-2 bg-purple-100 flex flex-col gap-3">
        {rightButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="w-full bg-purple-300 text-center py-3 px-4 rounded-md hover:bg-purple-400 transition-colors text-sm font-medium"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>  );
};

export default LeaderLayout;