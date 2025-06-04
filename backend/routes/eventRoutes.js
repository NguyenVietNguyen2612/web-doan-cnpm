const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes công khai
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Routes yêu cầu xác thực
router.post('/', authMiddleware.verifyToken, authMiddleware.isGroupLeader, eventController.createEvent);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isGroupLeader, eventController.updateEvent);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isGroupLeader, eventController.deleteEvent);

// Routes cho đặt chỗ
router.get('/:id/bookings', authMiddleware.verifyToken, eventController.getEventBookings);
router.post('/:id/bookings', authMiddleware.verifyToken, eventController.createBooking);
router.put('/:id/bookings/:bookingId', authMiddleware.verifyToken, eventController.updateBookingStatus);

module.exports = router; 