const express = require("express");
const TeacherModel = require("../models/TeacherModel");
const sendResponse = require("../Helper/Helper");
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await TeacherModel.find();
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      res.send(sendResponse(true, result, "Data Found")).status(200);
    }
  } catch (e) {
    console.log(e);
    res.send(sendResponse(false, null, "Server Internal Error")).status(400);
  }
});

route.get("/:id", (req, res) => {
  res.send("Get single Student Data");
});

route.post("/", async (req, res) => {
  let { name, course, contact } = req.body;
  try {
    let errArr = [];

    //validation Part
    if (!name) {
      errArr.push("Required FirstName");
    }
    if (!course) {
      errArr.push("Required course");
    }
    if (!contact) {
      errArr.push("Required contact");
    }

    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = { name, course, contact };
      let teacher = new TeacherModel(obj);
      await teacher.save();
      if (!teacher) {
        res.send(sendResponse(false, null, "Data Not Found")).status(404);
      } else {
        res.send(sendResponse(true, teacher, "Save Successfully")).status(200);
      }
    }
  } catch (e) {
    console.log(e);
    res.send(sendResponse(false, null, "Internal Server Error")).status(400);
  }
  res.send("Post single Student Data");
});

route.put("/:id", (req, res) => {
  res.send("put single Student Data");
});

route.delete("/:id", (req, res) => {
  res.send("single Student Data");
});
//example http://localhost:5000/api/student/4

module.exports = route;
