const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const StudentRouter = require("./routes/studentRouter");
const TeacherRouter = require("./routes/teacherRouter");
const InstituteRouter = require("./routes/instituteRouter");
const courseRouter = require("./routes/courseRouter");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
app.use(cors({
  origin:function(origin,callback){
    return callback(null,true)
  },
  optionsSuccessStatus:200,
  credentials:true
}));
app.use("/api/student", StudentRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/institute", InstituteRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Started");
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

