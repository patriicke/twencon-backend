const Posts = require("./../models/Posts");

const like = async (user, _id) => {
  try {
    const post = await Posts.findById(_id);
    const userExist = post.likes.find((currentUser) => {
      return currentUser._id === user._id;
    });
    if (!userExist) {
      post.likes.push(user);
      await Posts.updateOne({ _id }, { $set: { likes: post.likes } });
      return { message: "liked", post };
    }
    const updatedPost = post.likes.filter((currentUser) => {
      return currentUser._id !== user._id;
    });
    await Posts.updateOne({ _id }, { $set: { likes: updatedPost } });
    return { message: "unliked", post: await Posts.findById(_id) };
  } catch (error) {
    console.log(error);
  }
};

module.exports = like;
