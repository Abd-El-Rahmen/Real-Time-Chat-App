import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

const nodeDev = process.env.NODE_DEV;

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    nameSite: "strict",
    secure: nodeDev !== "development",
  });
  return token;
};
