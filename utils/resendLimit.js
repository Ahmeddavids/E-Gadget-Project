const rateLimit = require('express-rate-limit');

const resendOTPLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Allow 3 requests per minute from the same IP
    message: "Too many requests, please try again later.",
  });

  module.exports = resendOTPLimiter