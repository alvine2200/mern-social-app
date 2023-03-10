import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import { auth } from "./middleware/AuthTokenMiddleware.js";
import { Register } from "./controllers/AuthController.js";
import { CreatePost } from "./controllers/PostController.js";

//configs
const port = process.env.PORT || 6001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ extended: true, limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
//register with files
app.post("/api/v1/auth/register", upload.single("picture"), Register);
app.post("/api/v1/post/create", auth, upload.single("picture"), CreatePost);
//routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", auth, UserRoutes);
app.use("/api/v1/post", auth, PostRoutes);

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        app.listen(port, () => {
          console.log(
            `Database Connected, Server is running on port : ${port}`
          );
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          status: "failed",
          msg: "Server Cant start",
          error: error.message,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      msg: "Server Cant start",
      error: error.message,
    });
  }
};

start();
