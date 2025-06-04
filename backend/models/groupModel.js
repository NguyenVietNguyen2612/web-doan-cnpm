const db = require('../utils/db');

class Group {
  // Lấy tất cả nhóm
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM `GROUPS`');
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhóm:', error);
      throw error;
    }
  }

  // Lấy nhóm theo ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM `GROUPS` WHERE group_id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhóm:', error);
      throw error;
    }
  }

  // Tạo nhóm mới
  static async create(groupData) {
    try {
      const { name, description } = groupData;
      
      // Thêm các trường status và created_at
      const [result] = await db.query(
        'INSERT INTO `GROUPS` (name, description, status, created_at) VALUES (?, ?, ?, NOW())',
        [name, description, 'active']
      );
      
      console.log('Kết quả tạo nhóm:', result);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi chi tiết khi tạo nhóm:', error);
      throw error;
    }
  }

  // Cập nhật thông tin nhóm
  static async update(id, groupData) {
    try {
      const { name, description, status } = groupData;
      const [result] = await db.query(
        'UPDATE `GROUPS` SET name = ?, description = ?, status = ?, updated_at = NOW() WHERE group_id = ?',
        [name, description, status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhóm:', error);
      throw error;
    }
  }

  // Xóa nhóm
  static async delete(id) {
    try {
      // Xóa tất cả các thành viên trong nhóm trước
      await db.query('DELETE FROM MEMBERSHIPS WHERE group_id = ?', [id]);
      
      // Sau đó xóa nhóm
      const [result] = await db.query('DELETE FROM `GROUPS` WHERE group_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi xóa nhóm:', error);
      throw error;
    }
  }

  // Lấy danh sách thành viên của nhóm
  static async getMembers(groupId) {
    try {
      const [rows] = await db.query(`
        SELECT u.user_id, u.username, u.full_name, u.email, m.role_in_group, m.joined_at
        FROM USERS u
        JOIN MEMBERSHIPS m ON u.user_id = m.user_id
        WHERE m.group_id = ?
      `, [groupId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thành viên nhóm:', error);
      throw error;
    }
  }

  // Thêm thành viên vào nhóm
  static async addMember(groupId, userId, role) {
    try {
      console.log('Thêm thành viên vào nhóm:', { groupId, userId, role });
      
      // Kiểm tra xem thành viên đã tồn tại trong nhóm chưa
      const [existingMembers] = await db.query(
        'SELECT * FROM MEMBERSHIPS WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      
      if (existingMembers.length > 0) {
        console.log('Thành viên đã tồn tại trong nhóm');
        return existingMembers[0].id;
      }
      
      const [result] = await db.query(
        'INSERT INTO MEMBERSHIPS (user_id, group_id, role_in_group, joined_at) VALUES (?, ?, ?, NOW())',
        [userId, groupId, role]
      );
      
      console.log('Kết quả thêm thành viên:', result);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi chi tiết khi thêm thành viên vào nhóm:', error);
      throw error;
    }
  }

  // Xóa thành viên khỏi nhóm
  static async removeMember(groupId, userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM MEMBERSHIPS WHERE group_id = ? AND user_id = ?',
        [groupId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi xóa thành viên khỏi nhóm:', error);
      throw error;
    }
  }
}

module.exports = Group; 