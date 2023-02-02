import User from "../models/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const Register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      picturePath,
      occupation,
      location,
      password,
    } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(500)
        .json({ status: "failed", msg: "Email already taken" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      location,
      picturePath,
      occupation,
      password: hashedPassword,
      impressions: Math.floor(Math.random() * 1000),
      viewedProfile: Math.floor(Math.random() * 1000),
    });

    if (newUser) {
      const token = await jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
      );

      return res.status(201).json({
        status: "success",
        msg: "registration is a success",
        data: newUser,
        token: token,
      });
    }
  } catch (error) {
    console.log();
    return res.status(500).json({
      status: "failed",
      msg: "error registration",
      data: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExisting = await User.findOne({ email: email });
    if (!isExisting) {
      return res.status(500).json({
        status: "failed",
        msg: "Email Not Found",
      });
    }
    const isMatch = await bcrypt.compare(password, isExisting.password);
    if (!isMatch) {
      return res.status(500).json({
        status: "failed",
        msg: "Password/Email is wrong",
      });
    }
    const token = await jwt.sign({
      id: isExisting._id,
      email: isExisting.email,
    });
    if (token) {
      return res.status(200).json({
        status: "success",
        msg: "Login is a success",
        data: isExisting,
        token: token,
      });
    }
    return res.status(500).json({
      status: "failed",
      msg: "Something went wrong, try again",
    });
  } catch (error) {
    console.log();
    return res.status(500).json({
      status: "failed",
      msg: "error registration",
      data: error.message,
    });
  }
};
