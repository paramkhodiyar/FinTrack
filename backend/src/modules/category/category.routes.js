const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['ADMIN']), categoryController.createCategory);
router.get('/', categoryController.getCategories);

module.exports = router;
