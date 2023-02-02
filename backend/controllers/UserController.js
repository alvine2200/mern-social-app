import User from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    const { password, ...others } = user._doc;
    return res.status(200).json({
      status: "success",
      msg: "user grabbed successfully",
      data: others,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id });

    const friends = Promise.all(
      user.friends.map((id) => User.findById({ _id: id }))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, occupation, location }) => {
        _id, firstName, lastName, picturePath, occupation, location;
      }
    );
    return res.status(200).json({
      status: "success",
      msg: "friends grabbed successfully",
      data: formattedFriends,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

export const AddRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;
  try {
    const user = await User.findById({ _id: id });
    const friend = await User.findById({ _id: friendId });

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();
    const friends = Promise.all(
      user.friends.map((id) => User.findById({ _id: id }))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, occupation, location }) => {
        _id, firstName, lastName, picturePath, occupation, location;
      }
    );
    return res.status(200).json({
      status: "success",
      msg: "friends fetched successfully",
      data: formattedFriends,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ status: "failed", message: error.message });
  }
};
