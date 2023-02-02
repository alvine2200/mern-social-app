import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ status: "failed", msg: "Unauthorised access" });
  }
  const token = authHeader.split(" ")[1];
  if (token) {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    if (payload) {
      req.user = { userId: payload.id, email: payload.email };
      return next();
    } else {
      res.status(403).json({
        status: "failed",
        message: "Unauthorised access is forbidden,user not matched",
      });
    }
  } else {
    res.status(403).json({
      status: "failed",
      message: "Unauthorised access is forbidden, no token",
    });
  }
};
