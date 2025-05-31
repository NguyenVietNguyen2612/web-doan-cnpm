import api from './api';

// Mock implementation until backend is ready
const mockGroups = [
  { id: 1, name: 'Nhóm 1', memberCount: 6, createdDate: '21-5-2025', status: 'Đang hoạt động' },
  { id: 2, name: 'Nhóm 2', memberCount: 7, createdDate: '19-4-2025', status: 'Đang hoạt động' },
  { id: 3, name: 'Nhóm 3', memberCount: 5, createdDate: '3-4-2025', status: 'Dừng hoạt động' },
];

// Get all groups for the current user
export const getUserGroups = async () => {
  try {
    // When API is ready, use this:
    // const response = await api.get('/groups');
    // return response.data;
    
    // Mock response
    return {
      success: true,
      data: mockGroups,
      message: 'Lấy danh sách nhóm thành công',
    };
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Không thể lấy danh sách nhóm',
    };
  }
};

// Create a new group
export const createGroup = async (groupData) => {
  try {
    // When API is ready, use this:
    // const response = await api.post('/groups', groupData);
    // return response.data;
    
    // Mock response
    const newGroup = {
      id: mockGroups.length + 1,
      name: groupData.name,
      memberCount: 1, // Starting with just the creator
      createdDate: new Date().toLocaleDateString('vi-VN'),
      status: 'Đang hoạt động',
    };
    
    mockGroups.push(newGroup);
    
    return {
      success: true,
      data: newGroup,
      message: 'Tạo nhóm thành công',
    };
  } catch (error) {
    console.error('Error creating group:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Không thể tạo nhóm mới',
    };
  }
};

// Delete a group
export const deleteGroup = async (groupId) => {
  try {
    // When API is ready, use this:
    // const response = await api.delete(`/groups/${groupId}`);
    // return response.data;
    
    // Mock response
    const index = mockGroups.findIndex(group => group.id === groupId);
    if (index !== -1) {
      mockGroups.splice(index, 1);
    }
    
    return {
      success: true,
      message: 'Xóa nhóm thành công',
    };
  } catch (error) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      message: error.message || 'Không thể xóa nhóm',
    };
  }
};

// Get a specific group by ID
export const getGroupById = async (groupId) => {
  try {
    // When API is ready, use this:
    // const response = await api.get(`/groups/${groupId}`);
    // return response.data;
    
    // Mock response
    const parsedId = parseInt(groupId, 10);
    const group = mockGroups.find(g => g.id === parsedId);
    
    if (!group) {
      return {
        success: false,
        data: null,
        message: 'Không tìm thấy nhóm',
      };
    }
    
    // Add mock event details for this group
    const eventDetails = {
      name: 'Cf Góc Phố',
      location: 'Đường T1, Đông Hòa, Dĩ An, Bình Dương',
      time: 'Từ 8h - 15h',
      locationType: 'Quán cà phê',
      matchRate: '66.7%',
      bookingStatus: 'Chưa đặt',
      notificationStatus: 'Đã thông báo',
      attendeeCount: group.memberCount - 2, // Mock data: assuming not everyone is attending
    };
    
    return {
      success: true,
      data: {
        ...group,
        eventDetails
      },
      message: 'Lấy thông tin nhóm thành công',
    };
  } catch (error) {
    console.error('Error fetching group:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Không thể lấy thông tin nhóm',
    };
  }
};