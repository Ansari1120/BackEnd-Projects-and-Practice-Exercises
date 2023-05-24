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

route.put("/:id", (req, res) => {
  res.send("put single Student Data");
});

route.delete("/:id", (req, res) => {
  res.send("single Student Data");
});
//example http://localhost:5000/api/student/4

module.exports = route;
