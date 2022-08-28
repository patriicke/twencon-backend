const router = require("express").Router();
const User = require("./../models/Users");

//create user

router.post("/", async (req, res) => {
  try {
    const { email, fname, lname, password, profile, username } = req.body;
    const user = await User.create({
      email,
      fname,
      lname,
      password,
      profile,
      username
    });
    res.status(201).json(user);
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
