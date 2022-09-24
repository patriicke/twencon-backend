const User = require("./../models/Users");

const follow = async (user, friend) => {
  try {
    const userId = user._id;
    const friendId = friend._id;
    const userAccount = await User.findById(userId);
    const friendAccount = await User.findById(friendId);
    const followExist = userAccount.following.find((currentUser) => {
      return currentUser.email == friendAccount.email;
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
      return { message: "followed", data: { userAccount, friendAccount } };
    } else {
      const updatedUserAccount = userAccount.following.filter((currentUser) => {
        return currentUser.email !== friendAccount.email;
      });
      const updateFriendAccount = friendAccount.followers.filter(
        (currentUser) => {
          return currentUser.email !== userAccount.email;
        }
      );
      await User.updateOne(
        { email: userAccount.email },
        { $set: { following: updatedUserAccount } }
      );
      await User.updateOne(
        { email: friendAccount.email },
        { $set: { followers: updateFriendAccount } }
      );
      return { message: "unfollowed", data: { userAccount, friendAccount } };
    }
  } catch (error) {
    console.log(error);
  }
};  

module.exports = follow;
