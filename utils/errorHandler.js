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

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handling database validator error
exports.handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

exports.handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

exports.handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
