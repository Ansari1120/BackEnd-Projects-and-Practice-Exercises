const express = require("express");
const StudentModel = require("../models/StudentModel");
const sendResponse = require("../Helper/Helper");
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await StudentModel.find();
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
  let { firstName, lastName, email, password, contact } = req.body;
  try {
    let errArr = [];

    //validation Part
    if (!firstName) {
      errArr.push("Required FirstName");
    }
    if (!email) {
      errArr.push("Required email");
    }
    if (!password) {
      errArr.push("Required password");
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
      let obj = { firstName, lastName, email, password, contact };
      let student = new StudentModel(obj);
      await student.save();
      if (!student) {
        res.send(sendResponse(false, null, "Data Not Found")).status(404);
      } else {
        res.send(sendResponse(true, student, "Save Successfully")).status(200);
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
