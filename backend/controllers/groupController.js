import cloudinary from "../lib/cloudinary.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

const getGroupInfo = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId)
      .populate("members", "fullName profilePic email")
      .populate("admin", "fullName profilePic email");

    if (
      group &&
      (group.members.some(
        (member) => member._id.toString() === userId.toString()
      ) ||
        group.admin._id.toString() === userId.toString())
    ) {
      return res.status(200).json(group);
    }

    return res
      .status(403)
      .json({ message: "You do not have permission to access this group." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getGroups = async (req, res) => {
  const userId = req.user._id;
  try {
    const groups = await Group.find({
      $or: [{ admin: userId }, { members: { $in: [userId] } }],
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

const createGroup = async (req, res) => {
  const admin = req.user._id;
  const { name, members } = req.body;

  try {
    const newGroup = new Group({
      name,
      members,
      admin,
    });

    await newGroup.save();
    res
      .status(200)
      .json({ message: "Group created successfully.", group: newGroup });

    members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("groupCreated", newGroup);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating group." });
  }
};

const sendGroupMessage = async (req, res) => {
  const senderId = req.user._id;
  const { groupId, text, image } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.members.includes(senderId) && !group.admin === senderId) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group." });
    }
    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.error("Error uploading image:", err);
        return res.status(500).json({ message: "Error uploading image." });
      }
    }

    const newMessage = new Message({
      senderId: senderId,
      groupId: groupId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();
    const populatedMessage = await newMessage.populate(
      "senderId",
      "fullName profilePic email"
    );

    res.status(200).json(populatedMessage);

    group.members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("newGroupMessage", populatedMessage);
      }
    });

    if (senderId !== group.admin) {
      const socketId = getReceiverSocketId(group.admin);
      if (socketId) {
        io.to(socketId).emit("newGroupMessage", populatedMessage);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message." });
  }
};

const leaveGroup = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (
      !group.members.includes(userId) ||
      group.admin.toString() === userId.toString()
    ) {
      return res.status(400).json({ message: "You are not a member." });
    }

    group.members = group.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );
    await group.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Occured." });
  }
};

const deleteGroup = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.admin.toString() === userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to do this." });
    }

    const messages = await Message.find({ groupId });

    await Message.deleteMany({ groupId });

    await group.deleteOne();

    return res
      .status(200)
      .json({ message: "Group and associated messages deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const getGroupMessages = async (req, res) => {
  const { userId } = req.user._id;
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.members.includes(userId) && !group.admin === userId) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group." });
    }

    const messages = await Message.find({ groupId }).populate(
      "senderId",
      "fullName email profilePic"
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

export {
  sendGroupMessage,
  leaveGroup,
  createGroup,
  getGroupMessages,
  getGroups,
  getGroupInfo,
  deleteGroup
};
