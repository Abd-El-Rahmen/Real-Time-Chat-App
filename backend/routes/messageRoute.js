import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMessages,sendMessage } from "../controllers/messageController.js";

const router = express.Router();


router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
