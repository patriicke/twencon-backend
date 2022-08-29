const router = require("express").Router();
const User = require("./../models/Users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const createVerification = require("./../models/create-verification");
require("dotenv").config();
//create user

router.post("/signup", async (req, res) => {
  try {
    const { email, password, cpassword, username } = req.body;
    if (password !== cpassword)
      return res.status(400).json({ message: "Passwords don't match" });
    const user = await User.findOne({
      email
    });
    if (user) {
      return res.status(406).json({ message: "Email already exists" });
    }
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(406).json({ message: "Username already exists" });
    }
    const verificationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
    const verificationCodeReference = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
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
      html: `<!DOCTYPE html><html><body><h2>Twencon! Your verification code is:<span style="color:#4200FE;letter-spacing: 2px;"> ${verificationCode}</span></h2></body></html>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    const accessToken = jwt.sign(
      { ...req.body },
      process.env.ACCESS_TOKEN_SECRET
    );
    await createVerification.create({
      acc_token: accessToken,
      email,
      verificationCode,
      verificationReference:verificationCodeReference
    });
    return res
      .status(201)
      .json({ v_reference: verificationCodeReference, accessToken });
  } catch (error) {
    let msg;
    if (error.code == 11000) {
      msg = "User already exists";
    } else {
      msg = error.message;
    }
    console.log(error);
    res.status(400).json(msg);
  }
});

//login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
