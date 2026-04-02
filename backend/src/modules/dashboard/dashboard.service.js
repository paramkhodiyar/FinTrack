const prisma = require('../../prisma/client');

const getDateFilter = (period) => {
  const now = new Date();
  switch (period) {
    case 'TODAY':
      now.setHours(0, 0, 0, 0);
      return { gte: now };
    case 'LAST_WEEK':
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      return { gte: lastWeek };
    case 'LAST_MONTH':
      const lastMonth = new Date(now);
      lastMonth.setDate(now.getDate() - 30);
      return { gte: lastMonth };
    default:
      return undefined;
  }
};

const buildWhereClause = (filters) => {
  const where = { status: 'APPROVED' };
  if (filters.departmentId) where.departmentId = filters.departmentId;
  const dateFilter = getDateFilter(filters.period);
  if (dateFilter) where.date = dateFilter;
  return where;
};

const getSummary = async (filters = {}) => {
  const where = buildWhereClause(filters);

  const summary = await prisma.record.groupBy({
    by: ['nature'],
    where,
    _sum: { amount: true },
  });

  const totalIncome = summary.find((s) => s.nature === 'INCOME')?._sum.amount || 0;
  const totalExpense = summary.find((s) => s.nature === 'EXPENSE')?._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
};

const getCategoryBreakdown = async (filters = {}) => {
  const where = buildWhereClause(filters);

  const breakdown = await prisma.record.groupBy({
    by: ['categoryId'],
    where,
    _sum: { amount: true },
  });

  const categoryIds = breakdown.map((b) => b.categoryId).filter(Boolean);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });

  return breakdown.map((b) => ({
    categoryName: categories.find((c) => c.id === b.categoryId)?.name || 'Uncategorized',
    amount: b._sum.amount,
  }));
};

const getTrends = async (filters = {}) => {
  const where = buildWhereClause(filters);

  const data = await prisma.record.findMany({
    where,
    select: {
      amount: true,
      nature: true,
      date: true,
    },
    orderBy: { date: 'asc' },
  });

  // Group by day for more detailed line charts
  const trends = data.reduce((acc, curr) => {
    const period = curr.date.toISOString().substring(0, 10); // YYYY-MM-DD
    if (!acc[period]) {
      acc[period] = { period, income: 0, expense: 0 };
    }
    if (curr.nature === 'INCOME') acc[period].income += curr.amount;
    else acc[period].expense += curr.amount;
    return acc;
  }, {});

  return Object.values(trends);
};

const getDepartmentBreakdown = async (filters = {}) => {
  const where = buildWhereClause(filters);

  const breakdown = await prisma.record.groupBy({
    by: ['departmentId'],
    where,
    _sum: { amount: true },
  });

  const deptIds = breakdown.map((b) => b.departmentId).filter(Boolean);
  const departments = await prisma.department.findMany({
    where: { id: { in: deptIds } },
    select: { id: true, name: true },
  });

  return breakdown.map((b) => ({
    departmentName: departments.find((d) => d.id === b.departmentId)?.name || 'Unknown',
    amount: b._sum.amount,
  }));
};

const getRecentActivity = async (limit = 10) => {
  return prisma.record.findMany({
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      department: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getDepartmentBreakdown,
  getTrends,
  getRecentActivity,
};
