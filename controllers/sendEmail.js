const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (email, code, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verification code",
    html: `<!DOCTYPE html><html><body><h2>Twencon! Your ${type} code is:<span style="color:#4200FE;letter-spacing: 2px;"> ${code}</span></h2></body></html>`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
