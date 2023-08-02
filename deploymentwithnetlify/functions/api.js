const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const courseRouter = require("../src/routes/courseRouter");
const userRoutes = require("../src/routes/userRoutes");
const StudentRouter = require("../src/routes/studentRouter");
const TeacherRouter = require("../src/routes/teacherRouter");
const InstituteRouter = require("../src/routes/instituteRouter");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Started");
});

app.use("/.netlify/functions/api/course", courseRouter);
app.use("/.netlify/functions/api/teacher", TeacherRouter);
app.use("/.netlify/functions/api/Institute", InstituteRouter);
app.use("/.netlify/functions/api/student", StudentRouter);
app.use("/.netlify/functions/api/user", userRoutes);



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

module.exports.handler = serverless(app);
