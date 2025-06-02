import React from 'react';

/**
 * Layout cho trang thành viên nhóm
 * Hiển thị các nút chức năng bên phải và phần nội dung chính bên trái
 * 
 * @param {ReactNode} children - Nội dung chính của layout
 * @param {Array} rightButtons - Mảng các object chứa thông tin nút bên phải
 */
const MemberLayout = ({ children, rightButtons }) => {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Phần nội dung chính */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
        {/* Các nút chức năng bên phải */}
      <div className="w-full md:w-64 py-4 px-2 bg-blue-50 flex flex-col gap-3">
        {rightButtons && rightButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="w-full bg-blue-200 text-center py-3 px-4 rounded-md hover:bg-blue-300 transition-colors text-sm font-medium"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemberLayout;