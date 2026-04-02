const prisma = require('../../prisma/client');

const createCategory = async (data) => {
  return prisma.category.create({
    data: {
      name: data.name,
      nature: data.nature,
      parentId: data.parentId || null,
    },
  });
};

const getCategories = async () => {
  return prisma.category.findMany({
    include: {
      children: true,
      parent: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createCategory,
  getCategories,
};
