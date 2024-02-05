const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    console.log("Invalid data passed into the request");
    return res.status(400).send({
      status: 400,
      message: "Invalid data passed into the request",
    });
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name profilePicture email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePicture email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(200).send({
      status: 200,
      message: "Message send Sucessfully",
      data: message,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error : ${error.message}`,
    });
  }
});
const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    res.status(200).send({
      status: 200,
      message: "Messages of the chat retreived sucesscfully",
      data: messages,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error : ${error.message}`,
    });
  }
});

module.exports = {
  sendMessage,
  allMessage,
};
