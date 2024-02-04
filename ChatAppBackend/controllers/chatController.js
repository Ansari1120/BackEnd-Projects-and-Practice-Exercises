const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  //api for one on one chat.
  const { recipientId } = req.body;
  if (!recipientId) {
    console.log("Recipient id param does not send with request");
    return res.status(400).send({
      status: 400,
      message: "Recipient id does not send with request",
    });
  }

  let isChat = await Chat.find({
    //find if chat between query user(logged-in user) and recipient (to whom you message) exist. make sure while search for chat, each document seed(detail) must contain below key's value false.
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //and also make sure that both user and recipient This part checks if the "users" array in the document contains an element that matches the value of req.user._id.  It is using the $elemMatch operator to find a matching element.
      { users: { $elemMatch: { $eq: recipientId } } },
    ],
  })
    .populate("users", "-password") //.populate("users", "-password"): This line is likely using Mongoose's populate method to replace the  users field in the result with the actual user documents. The second argument  specifies that the password field should be excluded from the populated user documents. .populate("latestMessage"): Similarly, this line populates the latestMessage field, replacing it with the actual document from the referenced collection.
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePicture email",
  });

  if (isChat.length > 0) {
    res.status(200).send({
      status: 200,
      message: `Chat Retrieved Successfully between ${req.user._id} & ${recipientId}`,
      data: isChat[0],
    });
  } else {
    //create a new chat if it does not exist between this two. like create a chat room first time.
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, recipientId],
    };
    try {
      //save data in the database of newly created chat.
      const createdChat = await Chat.create(chatData);
      // access to full chat between two.
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send({
        status: 200,
        message: `A newly created chatroom between ${req.user._id} & ${recipientId}`,
        data: FullChat,
      });
    } catch (error) {
      res.status(400).send({
        status: 400,
        message: `Internal Server Error  ${error.message}`,
      });
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then((result) => {
        res.status(200).send({
          status: 200,
          message: "Your all chats and groups retrieved Successfully",
          data: result,
        });
      });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  if (!users || !name) {
    return res.status(400).send({
      status: 400,
      message: "All fields are required.",
    });
  }
  let fetchedUsers = JSON.parse(users);

  if (fetchedUsers.length < 2) {
    return res.status(400).send({
      status: 400,
      message: "More than 2 users are required to create a group chat.",
    });
  }
  //yourself(creator) of the group chat should be included in the group chat.

  fetchedUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: fetchedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      status: 200,
      message: "your group chat created Successfully.",
      data: fullGroupChat,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error : ${error.message}`,
    });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).send({
      status: 400,
      message:
        "Please provided both the fields chatname,chatId to rename group",
    });
  }
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (updatedChat) {
      return res.status(200).send({
        status: 200,
        message: "Chatname updated successfully",
        data: updatedChat,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: "Something went wrong while updating chatname",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error ${error.message}`,
    });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).send({
      status: 400,
      message: "Please provided both the fields userid,chatId to rename group",
    });
  }
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (added) {
      return res.status(200).send({
        status: 200,
        message: "New User Added to the group sucessfully.",
        data: added,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: "Something went wrong while adding new member to group chat",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error : ${error.message}`,
    });
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).send({
      status: 400,
      message: "Please provided both the fields userid,chatId to rename group",
    });
  }
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (removed) {
      return res.status(200).send({
        status: 200,
        message: "User removed from the group sucessfully.",
        data: removed,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: "Something went wrong while adding new member to group chat",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: `Internal Server Error : ${error.message}`,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
