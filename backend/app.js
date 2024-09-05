import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();

app.use(cookieParser());
app.use(express.json()); // to handle application/json
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.HOST_ORIGIN,
		credentials: true,
	}),
);
console.log(process.env.HOST_ORIGIN);

app.use(upload.none()); // to handle multipart/formData

import userRouter from "./src/routes/user.route.js";
import todoRouter from "./src/routes/todo.route.js";
import { verifyRefreshToken } from "./src/middlewares/auth.middleware.js";
import { generateToken } from "./src/utils/token.util.js";

app.use("/api/user", userRouter);
app.use("/api/todos", todoRouter);
app.get("/api/newToken", verifyRefreshToken, generateToken);

export default app;
