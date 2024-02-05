const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const notFound = require("./middleware/errMiddleware");
dotenv.config();

app.use(express.json());
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
        console.log(" user of id :", userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("room join by user of id :", room);
      });

      socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageReceived.sender._id) return;
          socket.in(user._id).emit("message recieved", newMessageReceived);
        });
      });
    });
  })
  .catch((err) => {
    throw new Error(`Internal Server Error : ${err.message}`);
  });
