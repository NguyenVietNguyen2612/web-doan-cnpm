const Booking = require('../models/bookingModel');

// Lấy tất cả đặt chỗ
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ' });
  }
};

// Lấy đặt chỗ theo ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.getById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin đặt chỗ' });
  }
};

// Tạo đặt chỗ mới
exports.createBooking = async (req, res) => {
  try {
    const { event_id, enterprise_id, booker_id, number_of_people, booking_time, notes } = req.body;

    if (!event_id || !enterprise_id || !booker_id || !number_of_people || !booking_time) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const bookingData = {
      event_id,
      enterprise_id,
      booker_id,
      number_of_people,
      booking_time,
      notes,
      status: 'pending' // Trạng thái mặc định
    };

    const bookingId = await Booking.create(bookingData);
    
    res.status(201).json({
      message: 'Đặt chỗ thành công',
      booking_id: bookingId
    });
  } catch (error) {
    console.error('Lỗi khi đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt chỗ' });
  }
};

// Cập nhật thông tin đặt chỗ
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { number_of_people, booking_time, notes, status } = req.body;

    // Kiểm tra xem đặt chỗ có tồn tại không
    const existingBooking = await Booking.getById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ' });
    }

    // Cập nhật thông tin đặt chỗ
    const bookingData = {
      number_of_people: number_of_people || existingBooking.number_of_people,
      booking_time: booking_time || existingBooking.booking_time,
      notes: notes || existingBooking.notes,
      status: status || existingBooking.status
    };

    const success = await Booking.update(bookingId, bookingData);
    
    if (success) {
      res.status(200).json({ message: 'Cập nhật thông tin đặt chỗ thành công' });
    } else {
      res.status(400).json({ message: 'Không thể cập nhật thông tin đặt chỗ' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin đặt chỗ' });
  }
};

// Cập nhật trạng thái đặt chỗ
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Trạng thái là bắt buộc' });
    }

    // Kiểm tra xem đặt chỗ có tồn tại không
    const existingBooking = await Booking.getById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ' });
    }

    const success = await Booking.updateStatus(bookingId, status);
    
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

// Xóa đặt chỗ
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Kiểm tra xem đặt chỗ có tồn tại không
    const existingBooking = await Booking.getById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt chỗ' });
    }

    const success = await Booking.delete(bookingId);
    
    if (success) {
      res.status(200).json({ message: 'Hủy đặt chỗ thành công' });
    } else {
      res.status(400).json({ message: 'Không thể hủy đặt chỗ' });
    }
  } catch (error) {
    console.error('Lỗi khi hủy đặt chỗ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy đặt chỗ' });
  }
};

// Lấy danh sách đặt chỗ theo người dùng
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.getByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ của người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ của người dùng' });
  }
};

// Lấy danh sách đặt chỗ theo doanh nghiệp
exports.getEnterpriseBookings = async (req, res) => {
  try {
    const enterpriseId = req.params.enterpriseId;
    const bookings = await Booking.getByEnterpriseId(enterpriseId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ của doanh nghiệp:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ của doanh nghiệp' });
  }
};

// Lấy danh sách đặt chỗ theo sự kiện
exports.getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const bookings = await Booking.getByEventId(eventId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ của sự kiện:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đặt chỗ của sự kiện' });
  }
}; 