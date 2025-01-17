import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";


const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erro Occured",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId)

    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

export {  getMessages, sendMessage };
