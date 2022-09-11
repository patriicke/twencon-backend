const router = require("express").Router();
const Posts = require("./../models/Posts");
router
  .route("/")
  .get(async (req, res) => {
    try {
      const posts = await Posts.find();
      return res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      console.log(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  });

module.exports = router;
