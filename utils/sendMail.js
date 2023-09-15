const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

//const asyncHandler = require("express-async-handler");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SERVICE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.MAIL_ID,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
  main().catch(console.error);
};


module.exports = { sendEmail };