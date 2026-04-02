const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, errorOrMessage = 'Internal Server Error', statusCode = 500, errors = null) => {
  let message = typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage?.message || 'Internal Server Error';

  if (typeof errorOrMessage === 'object' && errorOrMessage !== null) {
    if (errorOrMessage.code === 'P2002') {
      message = 'Unique constraint violation. A record with this value already exists.';
      statusCode = 400; 
    } else if (errorOrMessage.code === 'P2003') {
      message = 'Foreign key constraint violated. The referenced record does not exist.';
      statusCode = 400;
    } else if (errorOrMessage.code === 'P2025') {
       message = 'Record to update or delete not found.';
       statusCode = 404;
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
