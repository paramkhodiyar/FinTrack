const prisma = require('../../prisma/client');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
  const { name, email, password, role, departmentId } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      departmentId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
    },
  });
};

const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const users = await prisma.user.findMany({
    skip,
    take: parseInt(limit),
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      isActive: true,
    },
  });

  const total = await prisma.user.count();

  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const updateUserStatus = async (userId, isActive) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
};

module.exports = {
  createUser,
  getAllUsers,
  updateUserStatus,
};
