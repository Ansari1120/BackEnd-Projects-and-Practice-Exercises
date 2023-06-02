const express = require("express");
const route = express.Router();
const sendResponse = require("../Helper/Helper");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

route.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  const obj = { userName, email, password };
  let requiredArr = ["userName", "email", "password"];
  let errArr = [];

  requiredArr.forEach((x) => {
    if (!obj[x]) {
      errArr.push(x);
    }
  });

  if (errArr.length > 0) {
    res
      .send(sendResponse(false, null, "Some Fileds are Missing", errArr))
      .status(400);
    return;
  } else {
    let hashPassword = await bcrypt.hash(obj.password, 10);
    obj.password = hashPassword;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res
        .send(sendResponse(false, null, "This Email is Already Exist"))
        .status(403);
    } else {
      UserModel.create(obj)
        .then((result) => {
          res.send(sendResponse(true, result, "User Saved Successfully"));
        })
        .catch((err) => {
          res
            .send(sendResponse(false, err, "Internal Server Error"))
            .status(400);
        });
    }
  }
});
route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const obj = { email, password };

  UserModel.findOne({ email })
    .then(async (user) => {
      let isConfirm = await bcrypt.compare(obj.password, user.password);
      console.log(isConfirm);
      if (isConfirm) {
        res.send(sendResponse(true, user, "Login Successfully"));
      } else {
        res.send(sendResponse(false, null, "Credential Error"));
      }
    })
    .catch((err) => {
      res.send(sendResponse(false, err, "User Doesn't Exist"));
    });
});
route.post("/");
route.get("/");
route.put("/");
route.delete("/");

module.exports = route;
