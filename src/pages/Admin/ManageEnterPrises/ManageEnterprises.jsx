import React, { useState } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/common/Select';
import { HiOfficeBuilding, HiMail, HiPhone, HiGlobeAlt } from 'react-icons/hi';
import Scrollbar from '../../../components/common/Scrollbar';

const ManageEnterprises = () => {
  const [enterprises, setEnterprises] = useState([
    {
      id: 1,
      name: 'Nhà hàng ABC',
      email: 'contact@abc.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      website: 'https://abc-restaurant.com',
      type: 'Nhà hàng',
      status: 'active'
    },
    {
      id: 2,
      name: 'Quán Cafe XYZ',
      email: 'info@xyzcafe.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      website: 'https://xyzcafe.com',
      type: 'Cafe',
      status: 'active'
    },
  ]);

  const [selectedEnterprises, setSelectedEnterprises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(enterprises);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = enterprises.filter(
      (enterprise) =>
        enterprise.name.toLowerCase().includes(query.toLowerCase()) ||
        enterprise.email.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleLock = () => {
    if (selectedEnterprises.length === 0) {
      alert('Vui lòng chọn ít nhất một doanh nghiệp để khóa');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn khóa những doanh nghiệp đã chọn?')) {
      setEnterprises(enterprises.map(enterprise =>
        selectedEnterprises.some(selected => selected.id === enterprise.id)
          ? { ...enterprise, status: 'locked' }
          : enterprise
      ));
      setSelectedEnterprises([]);
    }
  };

  const handleDelete = () => {
    if (selectedEnterprises.length === 0) {
      alert('Vui lòng chọn ít nhất một doanh nghiệp để xóa');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn những doanh nghiệp đã chọn?')) {
      setEnterprises(enterprises.filter(enterprise =>
        !selectedEnterprises.some(selected => selected.id === enterprise.id)
      ));
      setSelectedEnterprises([]);
    }
  };

  const renderEnterpriseItem = (enterprise) => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          <HiOfficeBuilding className="mr-2 text-gray-600" />
          <span className="font-medium">{enterprise.name}</span>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            enterprise.status === 'locked' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {enterprise.status === 'locked' ? 'Đã khóa' : 'Đang hoạt động'}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiMail className="mr-2" />
          <span>{enterprise.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiPhone className="mr-2" />
          <span>{enterprise.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <HiGlobeAlt className="mr-2" />
          <a href={enterprise.website} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-800">
            {enterprise.website}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý doanh nghiệp</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search and action buttons */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow">
            <SearchBar
              placeholder="Tìm kiếm doanh nghiệp..."
              onSearch={handleSearch}
              autoFocus
            />
          </div>
          <button
            onClick={handleLock}
            disabled={selectedEnterprises.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedEnterprises.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Khóa doanh nghiệp
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedEnterprises.length === 0}
            className={`px-6 py-2 rounded-md ${
              selectedEnterprises.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-200 hover:bg-purple-300'
            }`}
          >
            Xóa doanh nghiệp
          </button>
        </div>

        {/* Enterprise list */}
        <Scrollbar height="calc(100vh - 280px)" className="pr-4">
          <Select
            items={searchResults}
            renderItem={renderEnterpriseItem}
            getItemKey={(enterprise) => enterprise.id}
            onItemSelect={setSelectedEnterprises}
            multiSelect={true}
            selectedItems={selectedEnterprises}
            title="Danh sách doanh nghiệp"
            selectAllLabel="Chọn tất cả"
            emptyMessage={
              searchQuery ? 'Không tìm thấy doanh nghiệp nào' : 'Chưa có doanh nghiệp nào'
            }
          />
        </Scrollbar>
      </div>
    </div>
  );
};

export default ManageEnterprises;
