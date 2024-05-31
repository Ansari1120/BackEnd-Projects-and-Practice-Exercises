const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const assetRoute = require("./routes/assetRoute");
const notFound = require("./middleware/errMiddleware");
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://front-end-projects-and-practice-exercises-react.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
// Allow requests from all origins
app.use(cors(corsOptions));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/asset", assetRoute);
app.get("/", (req, res) => {
  res.send("Server Started...");
});
app.use(notFound);

connectDB()
  .then(() => {
    let users = [];
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

      // Listen for status updates from clients
      socket.on("status", (userData) => {
        console.log("User status:", userData._id);
        if (!userData || !userData._id) {
          console.error("Invalid userData received:", userData);
          return;
        }
        // Check if the user already exists in the users array
        const existingUserIndex = users.findIndex(
          (user) => user.userID === userData._id
        );

        // If the user exists, update their status
        if (existingUserIndex !== -1) {
          users[existingUserIndex].status = "online";
        } else {
          // If the user doesn't exist, add them to the users array
          users.push({
            status: "online",
            userID: userData._id,
          });
        }

        // Emit the updated online users list to everyone except the sender
        console.log("Users status:", users);
        io.emit("users", users);
      });

      socket.on("manualStatusUpdate", (userData) => {
        // users.delete(userData._id);

        // Check if the user already exists in the users array
        const existingUserIndex = users.findIndex(
          (user) => user.userID === userData._id
        );

        // If the user exists, update their status
        if (existingUserIndex !== -1) {
          users[existingUserIndex].status = "offline";
          users[existingUserIndex].lastSeen = Date.now();
        }

        console.log("Users status:", users);
        io.emit("users", users);
      });

      socket.off("setup-off", (userData) => {
        console.log("user disconnected");
        const user = onlineUsers[userData._id];

        delete onlineUsers[userData._id]; // Remove user from online users
        io.emit("userStatus", {
          userId: userData._id,
          status: `offline`,
          lastActivity: user.lastActivity,
        });
        socket.leave(userData._id);
      });
    });
  })
  .catch((err) => {
    throw new Error(`Internal Server Error : ${err.message}`);
  });
