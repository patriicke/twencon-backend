const Posts = require("./../models/Posts");

const like = async (user, postId) => {
  try {
    const post = await Posts.findById(postId);
    const userExist = post.likes.find((currentUser) => {
      return currentUser.id === user?.id;
    });
    if (!userExist) {
      post.likes.push(user);
      await Posts.updateOne({ _id: postId }, { $set: { likes: post.likes } });
      return { message: "liked", post };
    }
    const updatedPost = post.likes.filter((currentUser) => {
      return currentUser.id !== user.id;
    });
    await Posts.updateOne({ _id: postId }, { $set: { likes: updatedPost } });
    return { message: "unliked", post: await Posts.findById(postId) };
  } catch (error) {
    console.log(error);
  }
};

module.exports = like;
