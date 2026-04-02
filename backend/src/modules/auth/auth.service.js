const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/client');
const { secret, expiresIn } = require('../../config/jwt');

const register = async (userData) => {
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

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, departmentId: user.departmentId },
    secret,
    { expiresIn }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
