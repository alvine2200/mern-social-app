import express from "express";
import {
  getFeedsPosts,
  getUserPosts,
  likePost,
} from "../controllers/PostController.js";
const router = express.Router();

router.get("/:userId/posts", getUserPosts);
router.get("/", getFeedsPosts);
router.post("/:id/like", likePost);

export default router;
