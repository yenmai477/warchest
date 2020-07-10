const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên của bạn!'],
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email!'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Vui lòng cung cấp địa chỉ email hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu!'],
    validate: {
      validator: function(password) {
        return password.length >= 8;
      },
      message: 'Mật khẩu phải dài tối thiểu 8 ký tự.',
    },
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Vui lòng xác nhập xác nhận mật khẩu'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Mật khẩu không trùng khớp! Vui lòng thử lại.',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); // 32

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
