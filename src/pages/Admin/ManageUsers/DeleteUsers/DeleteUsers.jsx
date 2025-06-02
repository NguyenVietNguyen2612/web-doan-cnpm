import React, { useState } from 'react';
import SearchBar from '../../../../components/common/SearchBar';
import Select from '../../../../components/common/Select';
import { HiMail, HiUser } from 'react-icons/hi';

/**
 * Component for searching and deleting users
 */
const DeleteUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sample user data (would typically come from API)
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'Member' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'Member' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'Leader' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'Member' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'Enterprise' },
  ];

  // Handle search submission
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter users by name or email containing the query
      const results = mockUsers.filter(
        (user) => 
          user.name.toLowerCase().includes(query.toLowerCase()) || 
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // Handle user selection
  const handleUserSelect = (selected) => {
    setSelectedUsers(selected);
  };

  // Render each user item in the select component
  const renderUserItem = (user) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center">
          <HiUser className="mr-2 text-gray-600" />
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiMail className="mr-2" />
          <span>{user.email}</span>
        </div>
      </div>
    );
  };

  // Handle lock button click
  const handleLock = () => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng để khóa');
      return;
    }

    console.log('Locking users:', selectedUsers);
    // In a real app, you would call an API here
    alert(`Đã khóa ${selectedUsers.length} người dùng`);
    
    // Reset selection
    setSelectedUsers([]);
  };

  // Handle delete button click
  const handleDelete = () => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn những người dùng đã chọn?')) {
      return;
    }

    console.log('Deleting users:', selectedUsers);
    // In a real app, you would call an API here
    alert(`Đã xóa ${selectedUsers.length} người dùng`);
    
    // Reset selection
    setSelectedUsers([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Title */}
      <div className="mb-6">
        <h2>Tìm kiếm</h2>
      </div>

      {/* Search section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search bar and action buttons */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow">
            <SearchBar 
              placeholder="Thanh tìm kiếm" 
              onSearch={handleSearch} 
              autoFocus
              className="w-full bg-gray-200 rounded-lg"
            />
          </div>
          <button
            onClick={handleLock}
            disabled={selectedUsers.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedUsers.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Khóa người dùng
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedUsers.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedUsers.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Xóa người dùng
          </button>
        </div>

        {/* Select component */}
        <Select
          items={searchResults}
          renderItem={renderUserItem}
          getItemKey={(user) => user.id}
          onItemSelect={handleUserSelect}
          multiSelect={true}
          selectedItems={selectedUsers}
          title="Danh sách tìm được"
          selectAllLabel="Chọn tất cả"
          emptyMessage={
            searchQuery ? 'Không tìm thấy kết quả nào' : 'Nhập từ khóa để tìm kiếm'
          }
          className="bg-gray-200"
        />
      </div>
    </div>
  );
};

export default DeleteUsers;
