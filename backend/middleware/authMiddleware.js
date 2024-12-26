import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });

    const decoded = jwt.verify(token, secretKey);
    if (!decoded)
      return res.status(401).json({
        message: "Unauthorized - Invalid Token",
      });

    const user = await User.findById(decoded.userId);

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};
