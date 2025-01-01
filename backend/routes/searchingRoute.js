import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { searchById, searchUsers } from "../controllers/searchController.js";

const router = express.Router();

router.get("/users/:name", protectRoute, searchUsers);
router.get("/one-user/:userId", protectRoute, searchById);

export default router