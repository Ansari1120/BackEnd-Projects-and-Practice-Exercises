const express = require("express");
const CourseModel = require("../models/CourseModel");
const sendResponse = require("../Helper/Helper");
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await CourseModel.find();
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
  let { name, duration, fees, shortName } = req.body;
  try {
    let errArr = [];

    //validation Part
    if (!name) {
      errArr.push("Required FirstName");
    }
    if (!duration) {
      errArr.push("Required duration");
    }
    if (!fees) {
      errArr.push("Required fees");
    }
    if (!shortName) {
      errArr.push("Required shortName");
    }

    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = { name, duration, fees, shortName };
      let Course = new CourseModel(obj);
      await Course.save();
      if (!Course) {
        res.send(sendResponse(false, null, "Data Not Found")).status(404);
      } else {
        res.send(sendResponse(true, Course, "Save Successfully")).status(200);
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
