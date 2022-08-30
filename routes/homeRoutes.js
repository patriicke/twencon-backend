const router = require("express").Router();
const User = require("./../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.route("/").post(async (req, res) => {
  const { acc_token } = req.body;
  if (!acc_token)
    return res.status(400).json({ message: "No access token provided" });
  const user = jwt.verify(acc_token, process.env.ACCESS_TOKEN_SECRET);
  if (!user)
    return res
      .status(403)
      .json({ message: "You are not allowd to acess this data" });
  const { email } = user;
  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res.status(404).json({ message: "No user found please" });
  const { profile, _id, fullname, username, status, telephone } = foundUser;
  return res.status(200).json({
    foundUser: {
      profile,
      _id,
      fullname,
      email,
      username,
      status,
      telephone
    }
  });
});

module.exports = router;
