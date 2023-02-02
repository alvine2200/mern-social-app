import dotenv from "dotenv";
dotenv.config();
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, occupation, location } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(500)
        .json({ status: "failed", msg: "Email already taken" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      location: location,
      occupation: occupation,
      password: hashedPassword,
      impressions: Math.floor(Math.random() * 1000),
      viewedProfile: Math.floor(Math.random() * 1000),
    });

    const { password, ...others } = newUser._doc;

    if (newUser) {
      const token = await jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
      );

      return res.status(201).json({
        status: "success",
        msg: "registration is a success",
        data: others,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "error registration",
      data: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email } = req.body;
    const isExisting = await User.findOne({ email: email });
    if (!isExisting) {
      return res.status(500).json({
        status: "failed",
        msg: "Email Not Found",
      });
    }
    const isMatch = await bcrypt.compare(
      req.body.password,
      isExisting.password
    );
    if (!isMatch) {
      return res.status(500).json({
        status: "failed",
        msg: "Password/Email is wrong",
      });
    }

    const token = await jwt.sign(
      {
        id: isExisting._id,
        email: isExisting.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY_TIME }
    );

    const { password, ...others } = isExisting._doc;
    if (token) {
      return res.status(200).json({
        status: "success",
        msg: "Login is a success",
        data: others,
        token: token,
      });
    }
    return res.status(500).json({
      status: "failed",
      msg: "Something went wrong, try again",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "error occured at login",
      data: error.message,
    });
  }
};
