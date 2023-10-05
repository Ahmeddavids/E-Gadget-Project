function forgotMailTemplate(link, firstname) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      background: linear-gradient(90deg, #0d99ffff, white);
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .container {
      max-width: 400px;
      padding: 40px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 36px;
      color: #0d99ffff;
      margin: 0;
    }

    .reset-button {
      display: block;
      width: 100%;
      max-width: 200px; 
      background-color: #0d99ffff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px; 
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin: 0 auto; 
    }

    .reset-button:hover {
      background-color: #444;
    }

    .key-symbol {
      display: block;
      text-align: center;
      font-size: 48px;
      margin-bottom: 20px;
      color: #007bff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="key-symbol">
      &#128272; <!-- Unicode for the key symbol -->
    </div>
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <p>Hello ${firstname},</p>
    <p>It seems you have requested to reset your password. Click the button below to proceed:</p>
    <a class="reset-button" href=${link}>Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,</p>
  </div>
</body>
</html>
  `;
}




function mailTemplate(otp, firstname) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
          }
          .content {
              padding: 20px;
          }
          .otp {
              font-size: 24px;
              text-align: center;
              color: #007bff;
              margin-top: 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>OTP Verification</h2>
          </div>
          <div class="content">
              <p>Hello ${firstname},</p>
              <p>Thank you for signing up with our service. To complete your registration, please enter the following OTP code:</p>
              <p class="otp"><strong>${otp}</strong></p>
              <p>This OTP code is valid for 10 minutes. Please do not share it with anyone.</p>
              <p>If you did not sign up for our service, please ignore this email.</p>
              <p>Best regards,</p>
              <p>E GADGET TEAM</p>
          </div>
      </div>
  </body>
  </html>  



`;
}


module.exports = {
  forgotMailTemplate,
  mailTemplate
}