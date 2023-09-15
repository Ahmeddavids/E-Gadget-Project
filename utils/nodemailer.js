const nodemailer = require('nodemailer');

// create a nodemailer transporter using gmail service
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
    secure: false
  }
});


module.exports = transporter