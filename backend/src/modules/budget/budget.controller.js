const budgetService = require('./budget.service');
const { successResponse, errorResponse } = require('../../utils/response');

const createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.body);
    return successResponse(res, budget, 'Budget created successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getBudgets = async (req, res) => {
  try {
    const filters = {};
    if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
      filters.departmentId = req.user.departmentId;
    }
    const budgets = await budgetService.getBudgets(filters);
    return successResponse(res, budgets, 'Budgets fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

module.exports = {
  createBudget,
  getBudgets,
};
