const prisma = require('../../prisma/client');

const createRecord = async (recordData, userId, departmentId) => {
  return prisma.record.create({
    data: {
      amount: parseFloat(recordData.amount),
      nature: recordData.nature,
      categoryId: recordData.categoryId,
      departmentId: recordData.departmentId || departmentId,
      date: new Date(recordData.date),
      notes: recordData.notes,
      createdById: userId,
      status: 'PENDING',
    },
  });
};

const getRecords = async (query = {}) => {
  const { page = 1, limit = 10, nature, categoryId, departmentId, status } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (nature) where.nature = nature;
  if (categoryId) where.categoryId = categoryId;
  if (departmentId) where.departmentId = departmentId;
  if (status) where.status = status;

  const records = await prisma.record.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy: { date: 'desc' },
    include: {
      category: true,
      department: true,
      createdBy: { select: { id: true, name: true } },
      approvedBy: { select: { id: true, name: true } },
    },
  });

  const total = await prisma.record.count({ where });

  return {
    records,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const updateRecordStatus = async (recordId, status, approvedById) => {
  return prisma.record.update({
    where: { id: recordId },
    data: {
      status,
      approvedById,
    },
  });
};

const deleteRecord = async (recordId) => {
  return prisma.record.delete({
    where: { id: recordId },
  });
};

const getRecordById = async (recordId, userRole, userDepartmentId) => {
  const record = await prisma.record.findUnique({
    where: { id: recordId },
    include: {
      category: true,
      department: true,
      createdBy: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true } },
    },
  });

  if (!record) {
    throw new Error('Record not found');
  }

  if (userRole === 'USER' && record.departmentId !== userDepartmentId) {
    throw new Error('Access denied to this department record');
  }

  return record;
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecordStatus,
  deleteRecord,
};
