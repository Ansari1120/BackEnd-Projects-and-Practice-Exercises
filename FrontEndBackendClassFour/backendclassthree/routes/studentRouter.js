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

route.get("/:id",async(req, res) => {
  try {
    let id = req.params.id
    const result = await StudentModel.findById(id);
    console.log(result)
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      res.send(sendResponse(true, result, "Data Found")).status(200);
    }
  } catch (e) {
    console.log(e);
    res.send(sendResponse(false, null, "Server Internal Error")).status(400);
  }});

route.get("/search", async (req, res) => {
  let { firstName, lastName } = req.body;
  try {
    let result = await StudentModel.find({
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

route.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await StudentModel.findById(id);
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      let updateResult = await StudentModel.findByIdAndUpdate(id, req.body, {
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
    let result = await StudentModel.findById(id);
    if (!result) {
      res
        .send(sendResponse(false, null, "No Data Found on this id"))
        .status(404);
    } else {
      let deleteById = await StudentModel.findByIdAndDelete(id);
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
