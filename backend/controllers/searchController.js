import User from "../models/User.js";

const escapeRegex = (text) => {
  return text.replace(/[\.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
};

const searchUsers = async (req, res) => {
  const { name = "" } = req.params;
  const userId = req.user._id;

  try {
    if (name.length > 0) {
      const regex = new RegExp(escapeRegex(name), "i");
      const Users = await User.find({
        fullName: { $regex: regex },
        _id: { $ne: userId },
      });
      return res.status(200).json({ results: Users });
    } else {
      const allUsers = await User.find();
      return res.status(200).json({ results: allUsers });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erro Occured",
    });
  }
};

const searchById = async (req, res) => {
  const { userId = "" } = req.params;
  try {
    const result = await User.findById(userId);
    if (result) return res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erro Occured",
    });
  }
};

export { searchUsers, searchById };
