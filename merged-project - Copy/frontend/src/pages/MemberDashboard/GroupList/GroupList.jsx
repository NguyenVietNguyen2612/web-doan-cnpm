import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/common/Modal';
import { getUserGroups, createGroup, deleteGroup } from '../../../services/groupService';
import uploadIcon from '../../../assets/images/LogoTaoNhom.jpeg';

const GroupList = () => {
  const navigate = useNavigate();
  
  // State for managing groups data
  const [groups, setGroups] = useState([]);

  // State for the selected group (for deletion)
  const [selectedGroup, setSelectedGroup] = useState(null);

  // State for handling modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for new group information
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    image: null
  });
  
  // Fetch user groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await getUserGroups();
      if (response.success) {
        setGroups(response.data);
      } else {
        console.error('Failed to fetch groups:', response.message);
      }
    };

    fetchGroups();
  }, []);

  // Function to handle creating a new group
  const handleCreateGroup = async () => {
    const response = await createGroup({
      name: newGroup.name || `Nhóm ${groups.length + 1}`,
      description: newGroup.description,
      // In a real app, you'd upload the image to a server and get a URL back
      imageUrl: newGroup.image 
    });

    if (response.success) {
      setGroups([...groups, response.data]);
      setIsCreateModalOpen(false);
      setNewGroup({ name: '', description: '', image: null });
    } else {
      alert('Không thể tạo nhóm: ' + response.message);
    }
  };

  // Function to handle group deletion
  const handleDeleteGroup = async () => {
    if (selectedGroup) {
      const response = await deleteGroup(selectedGroup.id);
      
      if (response.success) {
        setGroups(groups.filter(group => group.id !== selectedGroup.id));
        setIsDeleteModalOpen(false);
        setSelectedGroup(null);
      } else {
        alert('Không thể xóa nhóm: ' + response.message);
      }
    }
  };  // Function to handle selecting a group
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };
  
  // Function to handle double click on a group - routes to appropriate view based on user's role in the group
  const handleGroupDoubleClick = (group) => {
    // If the user is the leader of the group, navigate to the leader view
    if (group.isLeader) {
      navigate(`/groups/${group.id}/event-manager`);
    } else {
      // If the user is a regular member, navigate to the member view
      navigate(`/groups/${group.id}/member/event-viewer`);
    }
  };

  // Function to handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && selectedGroup) {
        setIsDeleteModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGroup]);

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewGroup({
        ...newGroup,
        image: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white p-6">
      {/* Header with title and create button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="mr-3 text-purple-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Lịch trình thông minh</h1>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo nhóm
        </button>
      </div>

      {/* Groups table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-700">Tên nhóm</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Số thành viên</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Ngày tạo</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Trạng thái nhóm</th>
            </tr>
          </thead>
          <tbody>            {groups.map((group) => (              <tr 
                key={group.id} 
                className={`border-b hover:bg-gray-50 cursor-pointer ${selectedGroup?.id === group.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleGroupSelect(group)}
                onDoubleClick={() => handleGroupDoubleClick(group)}
              >
                <td className="py-3 px-4">{group.name}</td>
                <td className="py-3 px-4">{group.memberCount}</td>
                <td className="py-3 px-4">{group.createdDate}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {group.status}
                    {group.isLeader && (
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">
                        Trưởng nhóm
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Group Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <div className="p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Tạo nhóm mới</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tải ảnh đại diện từ máy tính</label>
              <div className="flex items-center space-x-4">                <label className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <img src={uploadIcon} alt="Upload icon" className="w-10 h-10 object-cover rounded-full" />
                </label>
                
                {newGroup.image && (
                  <button
                    onClick={() => setNewGroup({...newGroup, image: null})}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Bỏ qua
                  </button>
                )}
              </div>
              
              {newGroup.image && (
                <div className="mt-2">
                  <img src={newGroup.image} alt="Group avatar preview" className="h-20 w-20 object-cover rounded-md"/>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Group Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Xóa nhóm khỏi danh sách?</h2>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={handleDeleteGroup}
              className="px-6 py-2 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700"
            >
              Đồng ý
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupList;
