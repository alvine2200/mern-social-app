import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: [30, "First name should be less than 30 characters"],
    },
    lastName: {
      type: String,
      required: true,
      maxlength: [30, "Last name should be less than 30 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, "Email should be less than 50 characters"],
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    impressions: {
      type: Number,
    },
    occupation: {
      type: String,
    },
    viewedProfile: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
