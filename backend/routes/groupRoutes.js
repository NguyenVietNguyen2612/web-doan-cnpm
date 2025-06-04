const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes công khai
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);

// Routes yêu cầu xác thực
router.post('/', authMiddleware.verifyToken, groupController.createGroup);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isGroupLeader, groupController.updateGroup);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isGroupLeader, groupController.deleteGroup);

// Routes cho thành viên
router.get('/:id/members', groupController.getGroupMembers);
// Cho phép tất cả thành viên nhóm thêm thành viên mới
router.post('/:id/members', authMiddleware.verifyToken, authMiddleware.isGroupMember, groupController.addMember);
router.delete('/:groupId/members/:userId', authMiddleware.verifyToken, authMiddleware.isGroupLeader, groupController.removeMember);

module.exports = router; 