import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ 
  post = {
    id: '',
    title: '',
    content: '',
    image: '',
    author: {
      id: '',
      name: '',
      avatar: ''
    },
    createdAt: new Date(),
    address: '',
    type: '',
    website: 'https://example.com', // Default website URL
    phone: '' // Optional phone number
  }
}) => {  // Format thời gian
  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} năm${interval > 1 ? '' : ''}`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} tháng`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} ngày`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} giờ`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} phút`;
    }
    
    return `${Math.floor(seconds)} giây`;
  };
  
  // Generate random phone number if not provided
  const phone = post.phone || `+84 ${Math.floor(Math.random() * 900000000) + 100000000}`;
  
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4">
        <Link to={`/enterprise/${post.author.id}`} className="cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mr-3 hover:opacity-80 transition-opacity">
            {post.author.name.charAt(0)}
          </div>
        </Link>
        <div>
          <div className="font-semibold flex items-center">
            <Link to={`/enterprise/${post.author.id}`} className="hover:text-blue-600 transition-colors">
              {post.author.name}
            </Link>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{post.type}</span>
            <span className="ml-2 text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500">{post.address}</p>
        </div>
      </div>
      
      {/* Title */}
      <div className="px-4 pb-2">
        <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 mb-2">{post.content}</p>
      </div>
      
      {/* Image */}
      {post.image && (
        <div className="w-full">
          <img 
            src={post.image} 
            alt={post.title || "Post image"} 
            className="w-full h-64 object-cover" 
          />
        </div>
      )}
      
      {/* Footer with contact and website info */}
      <div className="px-4 py-3 border-t">
        {/* Địa chỉ với icon */}
        <div className="flex items-center text-gray-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1114.142 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{post.address}</span>
        </div>
          {/* Phone number with icon */}
        <div className="flex items-center text-gray-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{phone}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;