const departmentService = require('./department.service');
const { successResponse, errorResponse } = require('../../utils/response');

const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await departmentService.createDepartment(name);
    return successResponse(res, department, 'Department created successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    return successResponse(res, departments, 'Departments fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
};
