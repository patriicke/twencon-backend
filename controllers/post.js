const Posts = require("./../models/Posts");

const post = async (currentPost) => {
  try {
    const { post, owner, date } = currentPost;
    const createdPost = await Posts.create({ post, owner, date });
    return createdPost;
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
module.exports = post;
