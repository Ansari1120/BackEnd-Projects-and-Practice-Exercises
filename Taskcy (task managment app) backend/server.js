const express = require("express");
const mongoose = require("mongoose");
const courseRouter = require("./routes/courseRouter");
const userRoutes = require("./routes/userRoutes");
const projectRouter = require("./routes/projectRouter");
const taskRouter = require("./routes/taskRouter");
const uploadRouter = require("./routes/teamRoute");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/course", courseRouter);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/image", uploadRouter);

app.get("/", (req, res) => {
  res.send("Server is Started....");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Database Connected Successfully and server is listening on this port 5000"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
