const express = require("express");
const InstituteModel = require("../models/InstituteModel");
const sendResponse = require("../Helper/Helper");
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await InstituteModel.find();
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

route.get("/:id",async (req, res) => {
  try {
    let id = req.params.id;
    const result = await InstituteModel.findById(id);
    console.log(result)
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
  let { name, address, shortName, tel } = req.body;
  try {
    let errArr = [];

    //validation Part
    if (!name) {
      errArr.push("Required FirstName");
    }
    if (!address) {
      errArr.push("Required address");
    }
    if (!tel) {
      errArr.push("Required contact");
    }

    if (errArr.length > 0) {
      res
        .send(sendResponse(false, errArr, null, "Required All Fields"))
        .status(400);
      return;
    } else {
      let obj = { name, address, shortName, tel };
      let Institute = new InstituteModel(obj);
      await Institute.save();
      if (!Institute) {
        res.send(sendResponse(false, null, "Data Not Found")).status(404);
      } else {
        res
          .send(sendResponse(true, Institute, "Save Successfully"))
          .status(200);
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
    let result = await InstituteModel.find({
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
    let result = await InstituteModel.findById(id);
    if (!result) {
      res.send(sendResponse(false, null, "No Data Found")).status(404);
    } else {
      let updateResult = await InstituteModel.findByIdAndUpdate(id, req.body, {
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
    let result = await InstituteModel.findById(id);
    if (!result) {
      res
        .send(sendResponse(false, null, "No Data Found on this id"))
        .status(404);
    } else {
      let deleteById = await InstituteModel.findByIdAndDelete(id);
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
