const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterpriseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes công khai
router.get('/', enterpriseController.getAllEnterprises);
router.get('/:id', enterpriseController.getEnterpriseById);

// Routes yêu cầu xác thực
router.post('/', authMiddleware.verifyToken, enterpriseController.createEnterprise);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isEnterpriseOrAdmin, enterpriseController.updateEnterprise);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, enterpriseController.deleteEnterprise);

// Routes cho bài đăng của doanh nghiệp
router.get('/:id/posts', enterpriseController.getEnterprisePosts);
router.post('/:id/posts', authMiddleware.verifyToken, authMiddleware.isEnterprise, enterpriseController.createPost);
router.put('/:id/posts/:postId', authMiddleware.verifyToken, authMiddleware.isEnterprise, enterpriseController.updatePost);
router.delete('/:id/posts/:postId', authMiddleware.verifyToken, authMiddleware.isEnterprise, enterpriseController.deletePost);

// Routes cho đặt chỗ của doanh nghiệp
router.get('/:id/bookings', authMiddleware.verifyToken, authMiddleware.isEnterpriseOrAdmin, enterpriseController.getEnterpriseBookings);
router.put('/:id/bookings/:bookingId', authMiddleware.verifyToken, authMiddleware.isEnterprise, enterpriseController.updateBookingStatus);

module.exports = router; 