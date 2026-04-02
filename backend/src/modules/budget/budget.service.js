const prisma = require('../../prisma/client');

const createBudget = async (data) => {
  return prisma.budget.create({
    data: {
      amount: parseFloat(data.amount),
      period: data.period, // e.g. "MONTHLY"
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      categoryId: data.categoryId || null,
      departmentId: data.departmentId,
    },
  });
};

const getBudgets = async (filters) => {
  const where = {};
  if (filters.departmentId) where.departmentId = filters.departmentId;

  return prisma.budget.findMany({
    where,
    include: {
      category: { select: { name: true } },
      department: { select: { name: true } },
    },
    orderBy: { startDate: 'desc' },
  });
};

module.exports = {
  createBudget,
  getBudgets,
};
