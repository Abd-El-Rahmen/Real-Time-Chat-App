import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js";
import groupRoute from "./routes/groupRoute.js";
import friendshipRoute from "./routes/friendShipRoute.js";
import searchingRoute from './routes/searchingRoute.js'
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const mongoDBURL = process.env.MONGODB_URL;
const FRONTEND = process.env.FRONTEND;

mongoose
  .connect(mongoDBURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: `${FRONTEND}`,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/friendship", friendshipRoute);
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/group", groupRoute);
app.use("/api/search", searchingRoute);

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
