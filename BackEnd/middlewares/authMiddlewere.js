import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";

const project = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        // console.log(token);

        //decodes token id
        const decoded = jwt.verify(token, process.env.MK);
        // console.log(decoded._id);
        //todo gán vào global req.user dùng ở mọi files
        req.user = await userModel.findById(decoded._id).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export default project;
