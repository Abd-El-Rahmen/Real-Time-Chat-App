import Friendship from "../models/Friendship.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const getFriends = async (req, res) => {
  const userId = req.user._id;
  try {
    const existingRequest = await Friendship.find({
      $and: [
        { $or: [{ sender: userId }, { receiver: userId }] },
        { status: "accepted" },
      ],
    })
      .populate("sender", "fullName profilePic email")
      .populate("receiver", "fullName profilePic email");

    if (!existingRequest) {
      return res.status(400).json({ message: "You have no friends." });
    }

    const friends = existingRequest.map((request) =>
      request.sender._id.toString() === userId.toString()
        ? request.receiver
        : request.sender
    );

    res.status(200).json(friends);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Error sending friend request." });
  }
};

const getFriendRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await Friendship.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "fullName profilePic email");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching friend requests.",
    });
  }
};

const getSentRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await Friendship.find({
      sender: userId,
      status: "pending",
    }).populate("receiver", "fullName profilePic email");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching friend requests.",
    });
  }
};

const sendFriendRequest = async (req, res) => {
  const senderId = req.user._id;
  const { id: receiverId } = req.params;

  try {
    const existingRequest = await Friendship.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friendship request already exists." });
    }

    const newRequest = new Friendship({
      sender: senderId,
      receiver: receiverId,
    });

    await newRequest.save();
    const senderInfo = await newRequest.populate(
      "sender",
      "fullName profilePic email"
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", {
        request: senderInfo,
      });
    }

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error sending friend request." });
  }
};

const changeFriendshipStatus = async (req, res) => {
  const userId = req.user._id;
  const { status, friendshipId } = req.body;

  try {
    const friendshipReq = await Friendship.findById(friendshipId).populate(
      "sender",
      "fullName profilePic email"
    );

    if (!friendshipReq || !status === "accepted") {
      return res
        .status(400)
        .json({ message: "Invalid status or friendship not found." });
    }

    if (friendshipReq.receiver.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Not allowed to change this friendship status." });
    }

    friendshipReq.status = status;
    await friendshipReq.save();

    const receiverSocketId = getReceiverSocketId(friendshipReq.sender._id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestAccepted", friendshipReq);
    }

    res.status(200).json(friendshipReq);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error changing friendship status." });
  }
};

const unfriendUser = async (req, res) => {
  const userId = req.user._id;
  const { id: unfriendedUserId } = req.params;

  try {
    if (userId === unfriendedUserId) {
      return res.status(400).json({ message: "You can't unfriend yourself." });
    }

    const friendship = await Friendship.findOne({
      $or: [
        { sender: userId, receiver: unfriendedUserId },
        { sender: unfriendedUserId, receiver: userId },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    await Friendship.deleteOne({ _id: friendship._id });

    const receiverSocketId = getReceiverSocketId(unfriendedUserId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("unfriendUser", { senderId: userId });
    }

    res.status(200).json({ message: "User unfriended successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error unfriending user." });
  }
};

export {
  sendFriendRequest,
  changeFriendshipStatus,
  unfriendUser,
  getFriends,
  getFriendRequests,
  getSentRequests,
};
