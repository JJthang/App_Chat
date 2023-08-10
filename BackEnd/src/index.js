import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/db.js";
import userRouter from "../Routers/userRoute.js";
import charRoute from "../Routers/charRoute.js";
import messRoute from "../Routers/messRoute.js";
import { socketIo } from "../config/socketIo.js";

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
const { PORT } = process.env;
connectDB();

app.use("/api", userRouter);
app.use("/api", charRoute);
app.use("/api", messRoute);

const server = app.listen(PORT, () => {
  console.log(`Ket noi thanh cong ${PORT}`);
});
socketIo(server);
