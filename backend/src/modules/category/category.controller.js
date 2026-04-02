const categoryService = require('./category.service');
const { successResponse, errorResponse } = require('../../utils/response');

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    return successResponse(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

module.exports = {
  createCategory,
  getCategories,
};
