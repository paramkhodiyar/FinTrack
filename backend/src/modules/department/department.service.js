const prisma = require('../../prisma/client');

const createDepartment = async (name) => {
  return prisma.department.create({
    data: { name },
  });
};

const getAllDepartments = async () => {
  return prisma.department.findMany();
};

module.exports = {
  createDepartment,
  getAllDepartments,
};
