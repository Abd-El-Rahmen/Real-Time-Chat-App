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
const groupSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);

    if (!groupSocketMap[groupId]) {
      groupSocketMap[groupId] = new Set();
    }
    groupSocketMap[groupId].add(userId);

    console.log(`${userId} joined group: ${groupId}`);
  });

  socket.on("sendGroupMessage", (groupId, message) => {
    if (groupSocketMap[groupId]) {
      console.log(`Message sent to group ${groupId}: ${message}`);
      io.to(groupId).emit("receiveGroupMessage", { userId, message });
    } else {
      console.log(`Group ${groupId} does not exist.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];

    for (const groupId of Object.keys(groupSocketMap)) {
      if (groupSocketMap[groupId].has(userId)) {
        groupSocketMap[groupId].delete(userId);
        if (groupSocketMap[groupId].size === 0) {
          delete groupSocketMap[groupId];
        }
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});

export { io, app, server };
