import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../Controllers/userController.js";
import project from "../middlewares/authMiddlewere.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", project, getUsers);

export default userRouter;
