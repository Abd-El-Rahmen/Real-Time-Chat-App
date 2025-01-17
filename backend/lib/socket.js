import { Server } from "socket.io";
import http from "http";
import express from "express";

const FRONTEND = process.env.FRONTEND;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [FRONTEND],
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});

export { io, app, server };
