const router = require("express").Router();
const User = require("./../models/Users");
const createVerificationModel = require("./../models/create-verification");
const createResetModel = require("./../models/reset-verifaction");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controllers/sendEmail");
require("dotenv").config();

// create user verifcation
router.route("/create/verify").post(async (req, res) => {
  try {
    const { v_code, acc_token } = req.body;
    if (!v_code)
      return res.status(400).json({ message: "Provide the details please" });
    if (acc_token == "undefined" || !acc_token)
      return res.status(400).json({ message: "Provide the details please" });
    const foundUser = jwt.verify(acc_token, process.env.ACCESS_TOKEN_SECRET);
    delete foundUser.iat;
    const isVerificationExist = await createVerificationModel.findOne({
      email: foundUser.email,
      verificationCode: v_code
    });
    if (!isVerificationExist)
      return res.status(403).json({ message: "Invalid verification code" });
    const refreshToken = jwt.sign(
      { ...foundUser },
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.create({ ...foundUser, refreshToken });
    return res.status(201).json({ user, acc_token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.route("/create/resend").post(async (req, res) => {
  try {
    const { v_reference } = req.body;
    console.log(req.body);
    if (v_reference === "undefined" || !v_reference)
      return res.status(403).json({ message: "No reference code given" });
    foundUser = await createVerificationModel.findOne({
      verificationReference: v_reference
    });
    if (!foundUser)
      return res.status(400).json({ message: "No reference code found" });
    const verificationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
    const verificationCodeReference = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
    sendEmail(foundUser.email, verificationCode, "verification");
    await createVerificationModel.updateOne(
      { email: foundUser.email },
      {
        $set: {
          verificationCode,
          verificationReference: verificationCodeReference
        }
      }
    );
    return res.status(201).json({ v_reference: verificationCodeReference });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.route("/reset").post(async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Please provide  your email" });
  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res
      .status(404)
      .json({ message: "Please signup no user with this email" });
  const resetCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const resetReferenceCode = Math.floor(
    Math.random() * (999999 - 100000) + 100000
  );
  sendEmail(email, resetCode, "reset");
  await createResetModel.create({
    email,
    resetCode,
    resetReferenceCode
  });
  return res.status(201).json({ r_reference: resetReferenceCode });
});

router.route("/reset/verify").post(async (req, res) => {
  try {
    const { v_code, acc_token } = req.body;
    if (!v_code)
      return res.status(400).json({ message: "Provide the details please" });
    if (acc_token == "undefined" || !acc_token)
      return res.status(400).json({ message: "Provide the details please" });
    const foundUser = jwt.verify(acc_token, process.env.ACCESS_TOKEN_SECRET);
    delete foundUser.iat;
    const isVerificationExist = await createVerificationModel.findOne({
      email: foundUser.email,
      verificationCode: v_code
    });
    if (!isVerificationExist)
      return res.status(403).json({ message: "Invalid verification code" });
    const refreshToken = jwt.sign(
      { ...foundUser },
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.create({ ...foundUser, refreshToken });
    return res.status(201).json({ user, acc_token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.route("/reset/resend").post(async (req, res) => {
  try {
    const { v_reference } = req.body;
    console.log(req.body);
    if (v_reference === "undefined" || !v_reference)
      return res.status(403).json({ message: "No reference code given" });
    foundUser = await createVerificationModel.findOne({
      verificationReference: v_reference
    });
    if (!foundUser)
      return res.status(400).json({ message: "No reference code found" });
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
      to: foundUser.email,
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
    await createVerificationModel.updateOne(
      { email: foundUser.email },
      {
        $set: {
          verificationCode,
          verificationReference: verificationCodeReference
        }
      }
    );
    return res.status(201).json({ v_reference: verificationCodeReference });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
