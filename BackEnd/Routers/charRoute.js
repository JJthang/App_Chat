import express from "express";
import project from "../middlewares/authMiddlewere.js";
import {
  accessChat,
  addGroup,
  createGroupChat,
  fetchChat,
  removegroup,
  renameGroup,
} from "../Controllers/chatController.js";

const charRoute = express.Router();

charRoute.post("/chat", project, accessChat);
//todo get : truyền token user vừa login
charRoute.get("/chat", project, fetchChat);
charRoute.post("/group", project, createGroupChat);
charRoute.put("/renameGroup", project, renameGroup);
charRoute.post("/addgroup", project, addGroup);
// charRoute.post("/removegroup", project, addGroup);
charRoute.put("/removegroup", project, removegroup);

export default charRoute;
