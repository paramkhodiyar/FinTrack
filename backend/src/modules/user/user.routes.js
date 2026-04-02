const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['ADMIN']), userController.createUser);
router.get('/', roleMiddleware(['ADMIN']), userController.getAllUsers);
router.patch('/:id/status', roleMiddleware(['ADMIN']), userController.updateUserStatus);

module.exports = router;
