const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

module.exports = authMiddleware;
