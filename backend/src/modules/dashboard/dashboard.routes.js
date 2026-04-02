const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);
router.get('/categories', dashboardController.getCategoryBreakdown);
router.get('/departments', dashboardController.getDepartmentBreakdown);
router.get('/trends', dashboardController.getTrends);
router.get('/activity', dashboardController.getRecentActivity);

module.exports = router;
