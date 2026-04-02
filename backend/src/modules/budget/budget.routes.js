const express = require('express');
const router = express.Router();
const budgetController = require('./budget.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');

router.use(authMiddleware);

router.post('/', roleMiddleware(['ADMIN']), budgetController.createBudget);
router.get('/', budgetController.getBudgets);

module.exports = router;
