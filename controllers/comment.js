const Posts = require("./../models/Posts");

const comment = async (userId, postId, textComment, date) => {
  try {
    const post = await Posts.findById(postId);
    post.comments.push({
      content: textComment,
      from: userId,
      date
    });
    await Posts.updateOne(
      { _id: postId },
      { $set: { comments: post.comments } }
    );
    return {
      message: "commented on a post",
      post: await Posts.findById(postId)
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = comment;
