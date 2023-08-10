import express from "express";
import project from "../middlewares/authMiddlewere.js";
import { getAllMess, sendMessage } from "../Controllers/messController.js";

const messRoute = express.Router();

messRoute.post("/send", project, sendMessage);
messRoute.get("/getMessage/:chatId", project, getAllMess);

export default messRoute;
