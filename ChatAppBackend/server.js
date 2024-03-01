const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const notFound = require("./middleware/errMiddleware");
dotenv.config();

app.use(express.json());
// Allow requests from all origins
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use(notFound);
app.get("/", (req, res) => {
  res.send("Server Started...");
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is Listning to the PORT : ${process.env.PORT}`);
    });
    const io = require("socket.io")(server, {
      pingTimeout: 60000, //60 thausand mili-second  = 1 minute after it went off to save bandwidth
      cors: {
        origin: process.env.CLIENT_BASE_URL,
      },
    });
    io.on("connection", (socket) => {
      console.log("Connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("user of id joins application :", userData._id);
        socket.emit("connected");
      });

      // chat id at client , room id at server we call if someone joins the space
      // to talk between them
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joins room of id :", room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          //dont emit back the message that i sended. only emit messages realtime of the recipient if send
          //into the room as a group scenario all 4 out of 5 exluding me should recieve new msg
          //only not me.
          if (user._id == newMessageReceived.sender._id) return;
          socket.in(user._id).emit("message recieved", newMessageReceived);
        });
      });

      socket.off("setup", (userData) => {
        console.log("user disconnected");
        socket.leave(userData._id);
      });
    });
  })
  .catch((err) => {
    throw new Error(`Internal Server Error : ${err.message}`);
  });
