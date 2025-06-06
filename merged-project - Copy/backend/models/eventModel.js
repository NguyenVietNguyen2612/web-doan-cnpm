const db = require('../utils/db');

class Event {
  // Lấy tất cả sự kiện
  static async getAll() {
    try {
      const query = `
        SELECT e.*, g.name as group_name
        FROM events e
        JOIN \`groups\` g ON e.group_id = g.group_id
        ORDER BY e.start_time DESC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      throw error;
    }
  }

  // Lấy sự kiện theo ID
  static async getById(id) {
    try {
      const query = `
        SELECT e.*, g.name as group_name
        FROM events e
        JOIN \`groups\` g ON e.group_id = g.group_id
        WHERE e.event_id = ?
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sự kiện:', error);
      throw error;
    }
  }

  // Lấy sự kiện theo group_id
  static async getByGroupId(groupId) {
    try {
      const query = `
        SELECT *
        FROM events
        WHERE group_id = ?
        ORDER BY start_time DESC
      `;
      const [rows] = await db.query(query, [groupId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện của nhóm:', error);
      throw error;
    }
  }

  // Tạo sự kiện mới
  static async create(eventData) {
    try {
      const { group_id, name, start_time, end_time, venue, status } = eventData;
      const query = `
        INSERT INTO events (group_id, name, start_time, end_time, venue, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [group_id, name, start_time, end_time, venue, status || 'planned'];
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      throw error;
    }
  }

  // Cập nhật thông tin sự kiện
  static async update(id, eventData) {
    try {
      const { name, start_time, end_time, venue, status } = eventData;
      const query = `
        UPDATE events
        SET name = ?, start_time = ?, end_time = ?, venue = ?, status = ?
        WHERE event_id = ?
      `;
      const values = [name, start_time, end_time, venue, status, id];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin sự kiện:', error);
      throw error;
    }
  }

  // Xóa sự kiện
  static async delete(id) {
    try {
      // Xóa tất cả các đặt chỗ liên quan đến sự kiện này trước
      await db.query('DELETE FROM bookings WHERE event_id = ?', [id]);
      
      // Sau đó xóa sự kiện
      const query = `
        DELETE FROM events
        WHERE event_id = ?
      `;
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      throw error;
    }
  }

  // Lấy danh sách đặt chỗ cho sự kiện
  static async getBookings(eventId) {
    try {
      const query = `
        SELECT b.*, en.name as enterprise_name, u.full_name as booker_name
        FROM bookings b
        JOIN enterprises en ON b.enterprise_id = en.enterprise_id
        JOIN users u ON b.booker_id = u.user_id
        WHERE b.event_id = ?
        ORDER BY b.booking_time DESC
      `;
      const [rows] = await db.query(query, [eventId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
      throw error;
    }
  }

  // Tạo đặt chỗ mới cho sự kiện
  static async createBooking(bookingData) {
    try {
      const { event_id, enterprise_id, booker_id, number_of_people, booking_time, notes } = bookingData;
      const query = `
        INSERT INTO bookings (event_id, enterprise_id, booker_id, number_of_people, booking_time, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
      `;
      const values = [event_id, enterprise_id, booker_id, number_of_people, booking_time, notes];
      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo đặt chỗ:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái đặt chỗ
  static async updateBookingStatus(bookingId, status) {
    try {
      const query = `
        UPDATE bookings
        SET status = ?
        WHERE booking_id = ?
      `;
      const values = [status, bookingId];
      const [result] = await db.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
      throw error;
    }
  }

  // Lấy danh sách sự kiện sắp tới
  static async getUpcoming() {
    try {
      const query = `
        SELECT e.*, g.name as group_name
        FROM events e
        JOIN \`groups\` g ON e.group_id = g.group_id
        WHERE e.start_time > NOW()
        ORDER BY e.start_time ASC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện sắp tới:', error);
      throw error;
    }
  }
}

module.exports = Event; 