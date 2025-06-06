import api from './api';

// Get all groups for the current user
export const getUserGroups = async () => {
  try {
    console.log('🚀 Calling API /groups/user/groups');
    const response = await api.get('/groups/user/groups');
    console.log('✅ API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user groups:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Không thể lấy danh sách nhóm',
    };
  }
};

// Create a new group
export const createGroup = async (groupData) => {
  try {    
    console.log('🚀 Calling API /groups with:', groupData);
    const response = await api.post('/groups', {
      name: groupData.name,
      description: groupData.description
    });
    console.log('✅ Create group response:', response.data);
    
    return {
      success: true,
      data: {
        id: response.data.group_id,
        name: groupData.name,
        memberCount: 1,
        createdDate: new Date().toLocaleDateString('vi-VN'),
        status: 'Đang hoạt động',
        isLeader: true
      },
      message: response.data.message || 'Tạo nhóm thành công',
    };
  } catch (error) {
    console.error('❌ Error creating group:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Không thể tạo nhóm mới',
    };
  }
};

// Delete a group
export const deleteGroup = async (groupId) => {
  try {
    console.log('🚀 Calling API DELETE /groups/' + groupId);
    const response = await api.delete(`/groups/${groupId}`);
    console.log('✅ Delete group response:', response.data);
    
    return {
      success: true,
      message: response.data.message || 'Xóa nhóm thành công',
    };
  } catch (error) {
    console.error('❌ Error deleting group:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Không thể xóa nhóm',
    };
  }
};

// Leave a group
export const leaveGroup = async (groupId) => {
  try {
    console.log('🚀 Calling API POST /groups/' + groupId + '/leave');
    const response = await api.post(`/groups/${groupId}/leave`);
    console.log('✅ Leave group response:', response.data);
    
    return {
      success: true,
      message: response.data.message || 'Rời nhóm thành công',
    };
  } catch (error) {
    console.error('❌ Error leaving group:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Không thể rời nhóm',
    };
  }
};

// Get a specific group by ID
export const getGroupById = async (groupId) => {
  try {
    console.log('🚀 Calling API /groups/' + groupId);
    const response = await api.get(`/groups/${groupId}`);
    console.log('✅ Get group response:', response.data);
    
    // Backend trả về: { success: true, data: {...}, message: "..." }
    if (response.data.success) {
      return {
        success: true,
        data: {
          ...response.data.data,
          id: response.data.data.group_id
        },
        message: response.data.message || 'Lấy thông tin nhóm thành công',
      };
    } else {
      return {
        success: false,
        data: null,
        message: response.data.message || 'Không thể lấy thông tin nhóm',
      };
    }
  } catch (error) {
    console.error('❌ Error fetching group:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Không thể lấy thông tin nhóm',
    };
  }
};

// Confirm participation in event (Mock for now - event API chưa ready)
export const confirmEventParticipation = async (groupId) => {
  try {
    // TODO: When event API is ready, use this:
    // const response = await api.post(`/groups/${groupId}/events/participate`);
    // return response.data;
    
    console.log('📝 Mock: Confirming event participation for group', groupId);
    
    // Mock response
    return {
      success: true,
      data: {
        participantCount: Math.floor(Math.random() * 5) + 2
      },
      message: 'Đã xác nhận tham gia sự kiện'
    };
  } catch (error) {
    console.error('❌ Error confirming event participation:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Không thể xác nhận tham gia'
    };
  }
};