import express from "express";
import {
  leaveGroup,
  createGroup,
  getGroupInfo,
  getGroupMessages,
  getGroups,
  sendGroupMessage,
  deleteGroup
} from "../controllers/groupController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/leaveGroup/:groupId", protectRoute, leaveGroup);
router.post("/createGroup", protectRoute, createGroup);
router.post("/sendGroupMessage", protectRoute, sendGroupMessage);
router.get("/groupMessages/:groupId", protectRoute, getGroupMessages);
router.get("/all", protectRoute, getGroups);
router.get("/:groupId", protectRoute, getGroupInfo);
router.delete("/delete/:groupId", protectRoute, deleteGroup);

export default router;
