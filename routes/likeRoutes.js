const router = require("express").Router();
const Posts = require("./../models/Posts");
router.route("/").post(async (req, res) => {
  try {
    const { user, _id } = req.body;
    const post = await Posts.findById(_id);
    const userExist = post.likes.find((currentUser) => {
      return currentUser._id === user._id;
    });
    if (!userExist) {
      post.likes.push(user);
      await Posts.updateOne({ _id }, { $set: { likes: post.likes } });
      return res.status(200).json({ message: "liked" });
    }
    const updatedPost = post.likes.filter((currentUser) => {
      return currentUser._id !== user._id;
    });

    await Posts.updateOne({ _id }, { $set: { likes: updatedPost } });
    return res.status(200).json({ message: "unliked" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
