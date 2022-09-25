const router = require("express").Router();
const Posts = require("./../models/Posts");
router
  .route("/")
  .get(async (req, res) => {
    try {
      const posts = await Posts.find();
      const sortedPosts = posts.sort((a, b) => {
        return b.date - a.date;
      });
      return res.status(200).json(sortedPosts);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { postId } = req.body;
      return res
        .status(200)
        .json({ post: await Posts.findById(postId.postId) });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
