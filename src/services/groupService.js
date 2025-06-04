import api from './api';

const BASE_PATH = '/groups';

// Get all groups for the current user
export const getUserGroups = async () => {
  try {
    const response = await api.get(`${BASE_PATH}`);
    return {
      success: true,
      data: response.data,
      message: 'Lấy danh sách nhóm thành công',
    };
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Không thể lấy danh sách nhóm',
    };
  }
};

// Create a new group
export const createGroup = async (groupData) => {
  try {    
    const response = await api.post(`${BASE_PATH}`, groupData);
    return {
      success: true,
      data: response.data,
      message: 'Tạo nhóm thành công',
    };
  } catch (error) {
    console.error('Error creating group:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Không thể tạo nhóm mới',
    };
  }
};

// Delete a group
export const deleteGroup = async (groupId) => {
  try {
    const response = await api.delete(`${BASE_PATH}/${groupId}`);
    return {
      success: true,
      message: 'Xóa nhóm thành công',
    };
  } catch (error) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể xóa nhóm',
    };
  }
};

// Leave a group
export const leaveGroup = async (groupId) => {
  try {
    const response = await api.delete(`${BASE_PATH}/${groupId}/members/me`);
    return {
      success: true,
      message: 'Rời nhóm thành công',
    };
  } catch (error) {
    console.error('Error leaving group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể rời nhóm',
    };
  }
};

// Get a specific group by ID
export const getGroupById = async (groupId) => {
  try {
    const response = await api.get(`${BASE_PATH}/${groupId}`);
    
    // Lấy thêm thông tin thành viên của nhóm
    const membersResponse = await api.get(`${BASE_PATH}/${groupId}/members`);
    
    return {
      success: true,
      data: {
        ...response.data,
        members: membersResponse.data
      },
      message: 'Lấy thông tin nhóm thành công',
    };
  } catch (error) {
    console.error('Error fetching group:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Không thể lấy thông tin nhóm',
    };
  }
};

// Thêm thành viên vào nhóm
export const addMember = async (groupId, userData) => {
  try {
    const response = await api.post(`${BASE_PATH}/${groupId}/members`, userData);
    return {
      success: true,
      data: response.data,
      message: 'Thêm thành viên thành công',
    };
  } catch (error) {
    console.error('Error adding member:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Không thể thêm thành viên',
    };
  }
};

// Xóa thành viên khỏi nhóm
export const removeMember = async (groupId, userId) => {
  try {
    const response = await api.delete(`${BASE_PATH}/${groupId}/members/${userId}`);
    return {
      success: true,
      message: 'Xóa thành viên thành công',
    };
  } catch (error) {
    console.error('Error removing member:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể xóa thành viên',
    };
  }
};

export default {
  getUserGroups,
  createGroup,
  deleteGroup,
  leaveGroup,
  getGroupById,
  addMember,
  removeMember
};