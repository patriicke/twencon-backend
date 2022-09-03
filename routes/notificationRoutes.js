const router = require("express").Router();
const User = require("./../models/Users");

router.route("/reset").post(async (req, res) => {
  const { email, room } = req.body;
  const user = await User.findOne({ email });
  delete user.newMessages[room];
  await User.updateOne(
    { email },
    {
      $set: {
        newMessages: { ...user.newMessages }
      }
    }
  );
});

module.exports = router;
