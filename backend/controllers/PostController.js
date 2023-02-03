import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";

export const getUserPosts = async (req, res) => {};
export const getFeedsPosts = async (req, res) => {};
export const likePost = async (req, res) => {};
export const CreatePost = async (req, file) => {
  try {
    const { id } = req.user.userId;
    const { description, picturePath } = req.body;
    const user = await User.findById({ _id: id });
    const newPost = await Post.create({
      userId: id,
      firstName: user.firstName,
      lastName: user.lastName,
      description: description,
      picturePath: picturePath,
      userPicturePath: user.picturePath,
      location: user.location,
      likes: {},
      comments: [],
    });
    const post = await Post.find();
    return res.status(201).json({
      status: "success",
      msg: "post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", error: error.message });
  }
};
