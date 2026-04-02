const dashboardService = require('./dashboard.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getSummary = async (req, res) => {
  try {
    const filters = { period: req.query.period };
    if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
      filters.departmentId = req.user.departmentId;
    }
    const data = await dashboardService.getSummary(filters);
    return successResponse(res, data, 'Summary fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const filters = { period: req.query.period };
    if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
      filters.departmentId = req.user.departmentId;
    }
    const data = await dashboardService.getCategoryBreakdown(filters);
    return successResponse(res, data, 'Category breakdown fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getTrends = async (req, res) => {
  try {
    const filters = { period: req.query.period };
    if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
      filters.departmentId = req.user.departmentId;
    }
    const data = await dashboardService.getTrends(filters);
    return successResponse(res, data, 'Trends fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getDepartmentBreakdown = async (req, res) => {
  try {
    const filters = { period: req.query.period };
    if (req.user.role !== 'ADMIN' && req.user.role !== 'ANALYST') {
      filters.departmentId = req.user.departmentId;
    }
    const data = await dashboardService.getDepartmentBreakdown(filters);
    return successResponse(res, data, 'Department breakdown fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await dashboardService.getRecentActivity(limit);
    return successResponse(res, data, 'Recent activity fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getDepartmentBreakdown,
  getTrends,
  getRecentActivity,
};
