const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false
},
isSuperAdmin: {
    type: Boolean,
    default: false
},
isAdmin: {
    type: Boolean,
    default: false
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastOtpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OTP'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
