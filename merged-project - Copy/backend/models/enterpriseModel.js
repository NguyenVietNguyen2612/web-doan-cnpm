const db = require('../utils/db');

class Enterprise {
  // Lấy tất cả doanh nghiệp
  static async getAll() {
    try {
      const query = `
        SELECT e.*, u.email
        FROM enterprises e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.name
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách doanh nghiệp:', error);
      throw error;
    }
  }

  // Lấy doanh nghiệp theo ID
  static async getById(id) {
    try {
      const query = `
        SELECT e.*, u.email
        FROM enterprises e
        JOIN users u ON e.user_id = u.id
        WHERE e.id = ?
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);
      throw error;
    }
  }

  // Lấy doanh nghiệp theo user_id
  static async getByUserId(userId) {
    try {
      const query = `
        SELECT *
        FROM enterprises
        WHERE user_id = ?
      `;
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin doanh nghiệp theo user_id:', error);
      throw error;
    }
  }

  // Tạo doanh nghiệp mới
  static async create(enterpriseData) {
    try {
      const { user_id, name, enterprise_type, contact_person, phone } = enterpriseData;
      const query = `
        INSERT INTO enterprises (user_id, name, enterprise_type, contact_person, phone, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const values = [user_id, name, enterprise_type, contact_person, phone];
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo doanh nghiệp:', error);
      throw error;
    }
  }

  // Cập nhật thông tin doanh nghiệp
  static async update(id, enterpriseData) {
    try {
      const { name, enterprise_type, contact_person, phone } = enterpriseData;
      const query = `
        UPDATE enterprises
        SET name = ?, enterprise_type = ?, contact_person = ?, phone = ?, updated_at = NOW()
        WHERE id = ?
      `;
      const values = [name, enterprise_type, contact_person, phone, id];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin doanh nghiệp:', error);
      throw error;
    }
  }

  // Xóa doanh nghiệp
  static async delete(id) {
    try {
      // Xóa tất cả các bài đăng liên quan đến doanh nghiệp này trước
      await db.query('DELETE FROM posts WHERE enterprise_id = ?', [id]);
      
      // Xóa tất cả các đặt chỗ liên quan đến doanh nghiệp này
      await db.query('DELETE FROM bookings WHERE enterprise_id = ?', [id]);
      
      // Sau đó xóa doanh nghiệp
      const query = `
        DELETE FROM enterprises
        WHERE id = ?
      `;
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi xóa doanh nghiệp:', error);
      throw error;
    }
  }

  // Lấy danh sách bài đăng của doanh nghiệp
  static async getPosts(enterpriseId) {
    try {
      const query = `
        SELECT *
        FROM posts
        WHERE enterprise_id = ?
        ORDER BY created_at DESC
      `;
      const [rows] = await db.query(query, [enterpriseId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài đăng:', error);
      throw error;
    }
  }

  // Lấy bài đăng theo ID
  static async getPostById(enterpriseId, postId) {
    try {
      const query = `
        SELECT *
        FROM posts
        WHERE enterprise_id = ? AND id = ?
      `;
      const [rows] = await db.query(query, [enterpriseId, postId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin bài đăng:', error);
      throw error;
    }
  }

  // Tạo bài đăng mới
  static async createPost(postData) {
    try {
      const { enterprise_id, title, content, image } = postData;
      const query = `
        INSERT INTO posts (enterprise_id, title, content, image, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const values = [enterprise_id, title, content, image];
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo bài đăng:', error);
      throw error;
    }
  }

  // Cập nhật bài đăng
  static async updatePost(enterpriseId, postId, postData) {
    try {
      const { title, content, image } = postData;
      const query = `
        UPDATE posts
        SET title = ?, content = ?, image = ?, updated_at = NOW()
        WHERE enterprise_id = ? AND id = ?
      `;
      const values = [title, content, image, enterpriseId, postId];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật bài đăng:', error);
      throw error;
    }
  }

  // Xóa bài đăng
  static async deletePost(enterpriseId, postId) {
    try {
      const query = `
        DELETE FROM posts
        WHERE enterprise_id = ? AND id = ?
      `;
      const [result] = await db.query(query, [enterpriseId, postId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi xóa bài đăng:', error);
      throw error;
    }
  }

  // Lấy danh sách đặt chỗ của doanh nghiệp
  static async getBookings(enterpriseId) {
    try {
      const query = `
        SELECT b.*, e.name as event_name, u.name as booker_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        JOIN users u ON b.booker_id = u.id
        WHERE b.enterprise_id = ?
        ORDER BY b.booking_time DESC
      `;
      const [rows] = await db.query(query, [enterpriseId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
      throw error;
    }
  }

  // Lấy đặt chỗ theo ID
  static async getBookingById(enterpriseId, bookingId) {
    try {
      const query = `
        SELECT b.*, e.name as event_name, u.name as booker_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        JOIN users u ON b.booker_id = u.id
        WHERE b.enterprise_id = ? AND b.id = ?
      `;
      const [rows] = await db.query(query, [enterpriseId, bookingId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đặt chỗ:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái đặt chỗ
  static async updateBookingStatus(bookingId, status) {
    try {
      const query = `
        UPDATE bookings
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;
      const values = [status, bookingId];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
      throw error;
    }
  }
}

module.exports = Enterprise; 