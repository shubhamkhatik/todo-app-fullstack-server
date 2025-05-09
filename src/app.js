import express from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/task.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todo-app-fullstack-client.vercel.app",
      "https://todo-app-fullstack-client-git-main-shubhamkhatiks-projects.vercel.app",
      "https://todo-app-fullstack-client-1qqoqgsdw-shubhamkhatiks-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", authRouter);
app.use("/api", taskRouter);
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log("Server is successfully listening on port..." + PORT);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
