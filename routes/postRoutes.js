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
      const { post, owner, date } = req.body;
      await Posts.create({ post, owner, date });
      return res.status(200).send({ message: "post created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

module.exports = router;
