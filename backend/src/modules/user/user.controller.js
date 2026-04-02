const userService = require('./user.service');
const { successResponse, errorResponse } = require('../../utils/response');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await userService.getAllUsers(page, limit);
    return successResponse(res, data, 'Users fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await userService.updateUserStatus(id, isActive);
    return successResponse(res, user, 'User status updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUserStatus,
};
