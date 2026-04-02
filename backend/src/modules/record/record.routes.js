const express = require('express');
const router = express.Router();
const recordController = require('./record.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['ADMIN', 'ENTRY_RECORDER']), recordController.createRecord);
router.get('/', roleMiddleware(['ADMIN', 'ANALYST', 'USER', 'ENTRY_RECORDER']), recordController.getRecords);
router.patch('/:id/approve', roleMiddleware(['ADMIN']), recordController.approveRecord);
router.delete('/:id', roleMiddleware(['ADMIN']), recordController.deleteRecord);

module.exports = router;
