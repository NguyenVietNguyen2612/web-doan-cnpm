const Group = require('../models/groupModel');

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.getAll();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách nhóm' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.getById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }
    
    // Get member count
    const members = await Group.getMembers(groupId);
    const memberCount = members.length;
    
    res.status(200).json({
      success: true,
      data: {
        ...group,
        memberCount: memberCount
      },
      message: 'Lấy thông tin nhóm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi lấy thông tin nhóm' 
    });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const groups = await Group.getUserGroups(userId);
    res.status(200).json({
      success: true,
      data: groups,
      message: 'Lấy danh sách nhóm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhóm của user:', error);
    res.status(500).json({ 
      success: false,
      data: [],
      message: 'Đã xảy ra lỗi khi lấy danh sách nhóm' 
    });
  }
};

exports.createGroup = async (req, res) => {
  try {
    console.log('Thông tin user từ token:', req.user);
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên nhóm là bắt buộc' });
    }

    const groupData = {
      name,
      description
    };

    console.log('Đang tạo nhóm với dữ liệu:', groupData);
    const groupId = await Group.create(groupData);
    console.log('Đã tạo nhóm với ID:', groupId);
    
    // Thêm người tạo nhóm vào nhóm với vai trò Leader
    if (req.user && req.user.user_id) {
      console.log('Thêm người tạo nhóm vào nhóm với vai trò Leader:', req.user.user_id);
      await Group.addMember(groupId, req.user.user_id, 'Leader');
      console.log('Đã thêm người tạo nhóm vào nhóm');
    } else {
      console.error('Không thể thêm người tạo nhóm vào nhóm: Không có thông tin user_id');
    }
    
    res.status(201).json({
      message: 'Tạo nhóm thành công',
      group_id: groupId
    });
  } catch (error) {
    console.error('Lỗi chi tiết khi tạo nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo nhóm', error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name, description, status } = req.body;

    // Kiểm tra xem nhóm có tồn tại không
    const existingGroup = await Group.getById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }

    // Cập nhật thông tin nhóm
    const groupData = {
      name: name || existingGroup.name,
      description: description || existingGroup.description,
      status: status || existingGroup.status
    };

    const success = await Group.update(groupId, groupData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật thông tin nhóm thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật thông tin nhóm' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin nhóm' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Kiểm tra xem nhóm có tồn tại không
    const existingGroup = await Group.getById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }

    const success = await Group.delete(groupId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa nhóm thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa nhóm' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa nhóm' });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Kiểm tra xem nhóm có tồn tại không
    const existingGroup = await Group.getById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }
    
    const members = await Group.getMembers(groupId);
    res.status(200).json(members);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thành viên nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách thành viên nhóm' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { user_id, role } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ message: 'ID người dùng là bắt buộc' });
    }
    
    // Kiểm tra xem nhóm có tồn tại không
    const existingGroup = await Group.getById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }
    
    // Thêm thành viên vào nhóm
    const membershipId = await Group.addMember(groupId, user_id, role || 'Member');
    
    res.status(201).json({
      message: 'Thêm thành viên vào nhóm thành công',
      membership_id: membershipId
    });
  } catch (error) {
    console.error('Lỗi khi thêm thành viên vào nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm thành viên vào nhóm' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.params.userId;
    
    // Kiểm tra xem nhóm có tồn tại không
    const existingGroup = await Group.getById(groupId);
    if (!existingGroup) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }
    
    // Xóa thành viên khỏi nhóm
    const success = await Group.removeMember(groupId, userId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa thành viên khỏi nhóm thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa thành viên khỏi nhóm' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa thành viên khỏi nhóm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thành viên khỏi nhóm' });
  }
}; 