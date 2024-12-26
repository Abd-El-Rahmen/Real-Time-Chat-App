import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    generateToken(findUser._id, res);
    res.status(200).json({
      _id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      profilePic: findUser.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erro Occured",
    });
  }
};

const signUpUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const findUser = await User.find({ email: email });

    if (findUser.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName: userName,
      email: email,
      password: hashedPwd,
    });
    await newUser.save();
    generateToken(newUser._id, res);
    res.status(200).json({
      success: true,
      message: "User Saved",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const updatePicture = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic is required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.url,
      },
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

export { loginUser, logoutUser, signUpUser, updatePicture };
