import express from "express";
const router = express.Router();
import { Login } from "../controllers/AuthController.js";

router.post("/login", Login);

export default router;
