const Posts = require("./../models/Posts");

const comment = async (user, _id, textComment, date) => {
  try {
    const post = await Posts.findById(_id);
    post.comments.push({
      content: textComment,
      from: user,
      date
    });
    await Posts.updateOne({ _id }, { $set: { comments: post.comments } });
    return { message: "commented on a post", post: await Posts.findById(_id) };
  } catch (error) {
    console.log(error);
  }
};

module.exports = comment;
