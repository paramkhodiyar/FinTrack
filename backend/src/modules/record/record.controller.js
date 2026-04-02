const recordService = require('./record.service');
const { successResponse, errorResponse } = require('../../utils/response');

const createRecord = async (req, res) => {
  try {
    const { userId, departmentId } = req.user;
    const record = await recordService.createRecord(req.body, userId, departmentId);
    return successResponse(res, record, 'Record created successfully', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getRecords = async (req, res) => {
  try {
    const data = await recordService.getRecords(req.query);
    return successResponse(res, data, 'Records fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const approveRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId } = req.user;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const record = await recordService.updateRecordStatus(id, status, userId);
    return successResponse(res, record, `Record ${status.toLowerCase()} successfully`);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await recordService.deleteRecord(id);
    return successResponse(res, null, 'Record deleted successfully');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, departmentId } = req.user;
    const data = await recordService.getRecordById(id, role, departmentId);
    return successResponse(res, data, 'Record fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 404);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  approveRecord,
  deleteRecord,
};
