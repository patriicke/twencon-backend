const router = require("express").Router();
const User = require("./../models/Users");
const jwt = require("jsonwebtoken");
const createVerification = require("./../models/create-verification");
const sendEmail = require("../controllers/sendEmail");
const bcrypt = require("bcrypt");
require("dotenv").config();
//create user
router.post("/signup", async (req, res) => {
  try {
    const { email, password, cpassword, username, telephone } = req.body;
    if (password !== cpassword)
      return res.status(400).json({ message: "Passwords don't match" });
    const foundUserByEmail = await User.findOne({
      email
    });
    if (foundUserByEmail) {
      return res.status(406).json({ message: "Email already exists" });
    }
    const foundUserByUsername = await User.findOne({ username });
    if (foundUserByUsername) {
      return res.status(406).json({ message: "Username already exists" });
    }
    const foundUserByTelephone = await User.findOne({ telephone });
    if (foundUserByTelephone) {
      return res.status(406).json({ message: "Telephone already exists" });
    }
    const verificationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
    const verificationCodeReference = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );
    sendEmail(email, verificationCode, "verification");
    const accessToken = jwt.sign(
      { ...req.body },
      process.env.ACCESS_TOKEN_SECRET
    );
    const isVerificationEmailExist = await createVerification.findOne({
      email: email
    });
    if (isVerificationEmailExist == null) {
      await createVerification.create({
        acc_token: accessToken,
        email,
        verificationCode,
        verificationReference: verificationCodeReference
      });
    } else {
      await createVerification.updateOne(
        { email },
        {
          $set: {
            acc_token: accessToken,
            verificationCode,
            verificationReference: verificationCodeReference
          }
        }
      );
    }
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
    const { _id, fullname, username, profile, status, telephone, newMessages } =
      user;
    const acc_token = jwt.sign(
      {
        _id,
        fullname,
        username,
        profile,
        status,
        telephone,
        newMessages,
        email
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(200).json({ acc_token });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
//upload photo
router.route("/upload").post(async (req, res) => {
  try {
    const { profile, email } = req.body;
    if (!email) return res.status(400).json({ message: "No email provided" });
    if (!profile)
      return res.status(401).json({ message: "No profile image provided" });
    await User.updateOne({ email }, { $set: { profile } });
    return res.status(201).json({ message: "profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

//reset user password

router.route("/password/reset").post(async (req, res) => {
  try {
    const { reset_token, password } = req.body;
    if (!reset_token | !password)
      return res.status(400).json({ message: "Please provide data" });
    const user = jwt.verify(reset_token, process.env.ACCESS_TOKEN_SECRET);
    const email = user.email;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    await User.updateOne(
      { email },
      {
        $set: { password: hashedPassword }
      }
    );
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
