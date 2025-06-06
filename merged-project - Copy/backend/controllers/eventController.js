const Event = require('../models/eventModel');

// Lấy tất cả sự kiện
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.status(200).json(events);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sự kiện' });
  }
};

// Lấy sự kiện theo ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.getById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin sự kiện' });
  }
};

// Tạo sự kiện mới
exports.createEvent = async (req, res) => {
  try {
    const { group_id, name, start_time, end_time, venue, status } = req.body;

    if (!group_id || !name || !start_time || !end_time) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const eventData = {
      group_id,
      name,
      start_time,
      end_time,
      venue,
      status
    };

    const eventId = await Event.create(eventData);
    
    res.status(201).json({
      message: 'Tạo sự kiện thành công',
      event_id: eventId
    });
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sự kiện' });
  }
};

// Cập nhật thông tin sự kiện
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, start_time, end_time, venue, status } = req.body;

    // Kiểm tra xem sự kiện có tồn tại không
    const existingEvent = await Event.getById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }

    // Cập nhật thông tin sự kiện
    const eventData = {
      name: name || existingEvent.name,
      start_time: start_time || existingEvent.start_time,
      end_time: end_time || existingEvent.end_time,
      venue: venue || existingEvent.venue,
      status: status || existingEvent.status
    };

    const success = await Event.update(eventId, eventData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật thông tin sự kiện thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật thông tin sự kiện' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin sự kiện' });
  }
};

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Kiểm tra xem sự kiện có tồn tại không
    const existingEvent = await Event.getById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }

    const success = await Event.delete(eventId);
    
    if (success) {
      res.status(200).json({ message: 'Xóa sự kiện thành công' });
    } else {
      res.status(400).json({ message: 'Không thể xóa sự kiện' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sự kiện' });
  }
};

// Lấy danh sách đặt chỗ cho sự kiện
exports.getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Kiểm tra xem sự kiện có tồn tại không
    const existingEvent = await Event.getById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    const bookings = await Event.getBookings(eventId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ' });
  }
};

// Tạo đặt chỗ mới cho sự kiện
exports.createBooking = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { enterprise_id, booker_id, number_of_people, booking_time, notes } = req.body;
    
    if (!enterprise_id || !booker_id || !number_of_people || !booking_time) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    
    // Kiểm tra xem sự kiện có tồn tại không
    const existingEvent = await Event.getById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    // Tạo đặt chỗ mới
    const bookingData = {
      event_id: eventId,
      enterprise_id,
      booker_id,
      number_of_people,
      booking_time,
      notes
    };
    
    const bookingId = await Event.createBooking(bookingData);
    
    res.status(201).json({
      message: 'Đặt chỗ thành công',
      booking_id: bookingId
    });
  } catch (error) {
    console.error('Lỗi khi đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt chỗ' });
  }
};

// Cập nhật trạng thái đặt chỗ
exports.updateBookingStatus = async (req, res) => {
  try {
    const eventId = req.params.id;
    const bookingId = req.params.bookingId;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Trạng thái là bắt buộc' });
    }
    
    // Kiểm tra xem sự kiện có tồn tại không
    const existingEvent = await Event.getById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
    }
    
    const success = await Event.updateBookingStatus(bookingId, status);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật trạng thái đặt chỗ thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật trạng thái đặt chỗ' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái đặt chỗ' });
  }
};

// Lấy danh sách sự kiện của một nhóm
exports.getEventsByGroupId = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const events = await Event.getByGroupId(groupId);
    
    res.status(200).json({
      success: true,
      data: events,
      message: 'Lấy danh sách sự kiện của nhóm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện của nhóm:', error);
    res.status(500).json({ 
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách sự kiện của nhóm' 
    });
  }
}; 