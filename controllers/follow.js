const User = require("./../models/Users");

const follow = async (user, friend) => {
  try {
    const userId = user.id;
    const friendId = friend.id;
    const userAccount = await User.findById(userId);
    const friendAccount = await User.findById(friendId);
    const followExist = userAccount.following.find((currentUser) => {
      return currentUser.id == friendId;
    });
    if (!followExist) {
      userAccount.following.push(friend);
      friendAccount.followers.push(user);
      await User.updateOne(
        { _id: userAccount._id },
        { $set: { following: userAccount.following } }
      );
      await User.updateOne(
        { _id: friendAccount._id },
        { $set: { followers: friendAccount.followers } }
      );
      return {
        message: "followed",
        users: await User.find(),
        follower: userId
      };
    } else {
      const updatedUserAccount = userAccount.following.filter((currentUser) => {
        return currentUser.id !== friendId;
      });
      const updateFriendAccount = friendAccount.followers.filter(
        (currentUser) => {
          return currentUser.id !== userId;
        }
      );
      await User.updateOne(
        { _id: userAccount._id },
        { $set: { following: updatedUserAccount } }
      );
      await User.updateOne(
        { _id: friendAccount._id },
        { $set: { followers: updateFriendAccount } }
      );
      return {
        message: "unfollowed",
        users: await User.find(),
        follower: userId
      };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = follow;
