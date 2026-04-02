const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

const registerUser = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return successResponse(res, user, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return successResponse(res, data, 'Login successful');
  } catch (error) {
    return errorResponse(res, error, 401);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
