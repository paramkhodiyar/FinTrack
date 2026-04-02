const express = require('express');
const router = express.Router();
const departmentController = require('./department.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['ADMIN']), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);

module.exports = router;
