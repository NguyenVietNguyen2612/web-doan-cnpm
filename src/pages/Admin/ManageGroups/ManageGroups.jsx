import React, { useState } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/common/Select';
import { HiUserGroup, HiUser, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import Scrollbar from '../../../components/common/Scrollbar';

const ManageGroups = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Nhóm A',
      leader: 'Nguyễn Văn A',
      memberCount: 15,
      createdAt: '2025-05-01',
      location: 'TP.HCM',
      status: 'active'
    },
    {
      id: 2,
      name: 'Nhóm B',
      leader: 'Trần Thị B',
      memberCount: 8,
      createdAt: '2025-05-15',
      location: 'Hà Nội',
      status: 'active'
    },
  ]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(groups);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.leader.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleLock = () => {
    if (selectedGroups.length === 0) {
      alert('Vui lòng chọn ít nhất một nhóm để khóa');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn khóa những nhóm đã chọn?')) {
      setGroups(groups.map(group =>
        selectedGroups.some(selected => selected.id === group.id)
          ? { ...group, status: 'locked' }
          : group
      ));
      setSelectedGroups([]);
    }
  };

  const handleDelete = () => {
    if (selectedGroups.length === 0) {
      alert('Vui lòng chọn ít nhất một nhóm để xóa');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn những nhóm đã chọn?')) {
      setGroups(groups.filter(group =>
        !selectedGroups.some(selected => selected.id === group.id)
      ));
      setSelectedGroups([]);
    }
  };

  const renderGroupItem = (group) => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          <HiUserGroup className="mr-2 text-gray-600" />
          <span className="font-medium">{group.name}</span>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            group.status === 'locked' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {group.status === 'locked' ? 'Đã khóa' : 'Đang hoạt động'}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiUser className="mr-2" />
          <span>Trưởng nhóm: {group.leader}</span>
          <span className="mx-2">•</span>
          <span>{group.memberCount} thành viên</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiCalendar className="mr-2" />
          <span>Ngày tạo: {new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiLocationMarker className="mr-2" />
          <span>{group.location}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý nhóm</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search and action buttons */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow">
            <SearchBar
              placeholder="Tìm kiếm nhóm..."
              onSearch={handleSearch}
              autoFocus
            />
          </div>
          <button
            onClick={handleLock}
            disabled={selectedGroups.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedGroups.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Khóa nhóm
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedGroups.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedGroups.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Xóa nhóm
          </button>
        </div>

        {/* Group list */}
        <Scrollbar height="calc(100vh - 280px)" className="pr-4">
          <Select
            items={searchResults}
            renderItem={renderGroupItem}
            getItemKey={(group) => group.id}
            onItemSelect={setSelectedGroups}
            multiSelect={true}
            selectedItems={selectedGroups}
            title="Danh sách nhóm"
            selectAllLabel="Chọn tất cả"
            emptyMessage={
              searchQuery ? 'Không tìm thấy nhóm nào' : 'Chưa có nhóm nào'
            }
          />
        </Scrollbar>
      </div>
    </div>
  );
};

export default ManageGroups;
