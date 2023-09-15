const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set the TTL (Time To Live) which is the expiration time
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const OTP = mongoose.model('OTP', otpSchema, 'OTP');

module.exports = OTP;
