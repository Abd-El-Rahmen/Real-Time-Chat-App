import express from "express";
import {
  addMemberToGroup,
  createGroup,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/groupController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/addMemberToGroup/:groupId", protectRoute, addMemberToGroup);
router.post("/createGroup", protectRoute, createGroup);
router.post("/sendGroupMessage", protectRoute, sendGroupMessage);
router.get("/groupMessages/:groupId", protectRoute, getGroupMessages);

export default router;
