const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes yêu cầu xác thực
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, bookingController.getAllBookings);
router.get('/:id', authMiddleware.verifyToken, bookingController.getBookingById);
router.post('/', authMiddleware.verifyToken, bookingController.createBooking);
router.put('/:id', authMiddleware.verifyToken, bookingController.updateBooking);
router.delete('/:id', authMiddleware.verifyToken, bookingController.deleteBooking);

// Routes cho trạng thái đặt chỗ
router.put('/:id/status', authMiddleware.verifyToken, bookingController.updateBookingStatus);

module.exports = router; 