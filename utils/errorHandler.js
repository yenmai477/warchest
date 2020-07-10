const AppError = require('./appError');

// Handling invalid database ID or parse data errror
exports.handleCastErrorDB = err => {
  // const message = `Invalid ${err.path}: ${err.stringValue}.`;
  const message = `Invalid ${err.path}: ${err.stringValue}.`;
  return new AppError(message, 400);
};

// Handling duplicate database fields
exports.handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `${value} đã tồn tại. Vui lòng sử dụng giá trị khác!`;
  return new AppError(message, 400);
};

// Handling database validator error
exports.handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Dữ liệu không hợp lệ. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

exports.handleJWTError = () =>
  new AppError('Token không hợp lệ. Vui lòng đăng nhập lại!', 401);

exports.handleJWTExpiredError = () =>
  new AppError('Token đã hết hạn! Vui lòng đăng nhập lại.', 401);
