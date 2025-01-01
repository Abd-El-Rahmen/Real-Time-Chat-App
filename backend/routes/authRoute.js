import express from "express";
import {
  loginUser,
  signUpUser,
  logoutUser,
  updatePicture,
  getUserInfo
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/get-user/:userId", protectRoute,getUserInfo);
router.post("/signup", signUpUser);
router.post("/logout", logoutUser);
router.put("/update-picture", protectRoute, updatePicture);
router.get("/check", protectRoute, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated User",
    user,
  });
});

export default router;
