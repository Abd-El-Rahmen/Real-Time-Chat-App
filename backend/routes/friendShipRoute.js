import express from "express";
import {
  sendFriendRequest,
  changeFriendshipStatus,
  unfriendUser,
  getFriends,
  getFriendRequests,
  getSentRequests,
} from "../controllers/friendshipController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sent-req", protectRoute, getSentRequests);
router.post("/send/:id", protectRoute, sendFriendRequest);
router.get("/friends", protectRoute, getFriends);
router.get("/requests", protectRoute, getFriendRequests);
router.put("/status", protectRoute, changeFriendshipStatus);
router.delete("/unfriend/:id", protectRoute, unfriendUser);

export default router;
