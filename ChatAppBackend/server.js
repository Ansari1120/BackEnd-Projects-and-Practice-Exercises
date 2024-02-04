const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const notFound = require("./middleware/errMiddleware");
dotenv.config();

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoute);
app.use(notFound);
app.get("/", (req, res) => {
  res.send("Server Started...");
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is Listning to the PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    throw new Error(`Internal Server Error : ${err.message}`);
  });
