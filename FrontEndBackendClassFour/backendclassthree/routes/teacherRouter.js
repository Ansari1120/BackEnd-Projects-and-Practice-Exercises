const express = require("express");
const TeacherModel = require("../models/TeacherModel");
const sendResponse = require("../Helper/Helper");
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    let { page, limit, sort, asc } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;

    const skip = (page - 1) * 10;
    const result = await TeacherModel.find()
      .sort({ [sort]: asc })
      .skip(skip)
      .limit(limit);
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      res
        .send(sendResponse(true, result, "Data Found", "", page, limit))
        .status(200);
    }
  } catch (e) {
    console.log(e);
    res.send(sendResponse(false, null, "Server Internal Error")).status(400);
  }
});

route.get("/:id", async (req, res) => {
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

route.get("/search", async (req, res) => {
  let { firstName, lastName } = req.body;
  try {
    let result = await TeacherModel.find({
      firstName: firstName,
      lastName: lastName,
    });
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      res.send(sendResponse(true, result), "Data found").status(200);
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Server Error")).status(400);
  }
});

route.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await TeacherModel.findById(id);
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      let updateResult = await TeacherModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updateResult) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, updateResult, "Data updated SucessFully"))
          .status(200);
      }
    }
  } catch (e) {
    res.send(sendResponse(false, null, "Internal Server Error")).status(400);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await TeacherModel.findById(id);
    if (!result) {
      res
        .send(sendResponse(false, null, "No Data Found on this id"))
        .status(404);
    } else {
      let deleteById = await TeacherModel.findByIdAndDelete(id);
      if (!deleteById) {
        res.send(sendResponse(false, null, "Error")).status(404);
      } else {
        res
          .send(sendResponse(true, deleteById, "Data Deleted SucessFully"))
          .status(200);
      }
    }
  } catch (e) {
    res
      .send(sendResponse(true, deleteById, "Internal Server Error"))
      .status(400);
  }
});

//example http://localhost:5000/api/student/4

module.exports = route;
