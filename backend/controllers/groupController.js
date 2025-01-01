import cloudinary from "../lib/cloudinary.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

const createGroup = async (req, res) => {
  const admin = req.user;
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

const addMemberToGroup = async (req, res) => {
    const {userId} = req.user._id
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member." });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "User added to group.", group });

    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      io.to(socketId).emit("groupJoined", groupId);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding member to group." });
  }
};

const sendGroupMessage = async (req, res) => {
  const senderId = req.user;
  const { groupId, text, image } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (!group.members.includes(senderId)) {
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
      senderId,
      groupId,
      text,
      imageUrl,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent to group.", newMessage });

    group.members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("receiveGroupMessage", {
          groupId,
          senderId,
          text,
          imageUrl,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message." });
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

    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group." });
    }

    const messages = await Message.find({ groupId }).sort({ createdAt: -1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

export { sendGroupMessage, addMemberToGroup, createGroup, getGroupMessages };
