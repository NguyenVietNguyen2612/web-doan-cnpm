// filepath: e:\web-doan-third\web-doan-cnpm\src\components\common\Logo.jsx
import React from 'react';
import LogoClock from '../../assets/images/LogoClock.png';

const Logo = ({ size = 'default' }) => {
  const sizes = {
    small: {
      container: 'w-8 h-8',
      img: 'w-6 h-6',
      text: 'text-sm'
    },
    default: {
      container: 'w-12 h-12',
      img: 'w-8 h-8',
      text: 'text-xl'
    },
    large: {
      container: 'w-16 h-16',
      img: 'w-12 h-12',
      text: 'text-2xl'
    }
  };
  
  const currentSize = sizes[size] || sizes.default;
  
  return (
    <div className="flex items-center">
      <div className={`p-1 flex items-center justify-center mr-1 ${currentSize.container}`}>
        <img src={LogoClock} alt="Logo" className={currentSize.img} />
      </div>
      <h3 className={`text-black ${currentSize.text}`}>Lịch trình thông minh</h3>
    </div>
  );
};

export default Logo;