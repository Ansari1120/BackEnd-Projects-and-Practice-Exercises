const express = require("express");
const router = express.Router();
const sendResponse = require("./Helper");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AuthController = require("../Controller/authController");
const multer = require("multer");
const generateRandomToken = require("./randomToken");
const sendEmail = require("./sendEmail");
const cloudinary = require("cloudinary").v2;

const handleUser = async (req, res) => {
  const { userName, email, password, avatar } = req.body;
  const obj = { userName, email, password, avatar };
  let requiredArr = ["userName", "email", "password", "avatar"];
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
    const existingUser = await userModel.findOne({ email });
    const token = generateRandomToken(5);
    console.log(token);

    obj.password = hashPassword;
    obj.avatar = avatar;
    obj.resettoken = token;
    obj.resettokenExpiration = Date.now() + 3600000;

    // if (req.file) {
    //   const avatarUrl = await imageUpload(req.file.buffer);
    //   obj.avatar = avatarUrl;
    // } else {
    //   obj.avatar =
    //     "https://extendedevolutionarysynthesis.com/wp-content/uploads/2018/02/avatar-1577909_960_720.png";
    // }

    if (existingUser) {
      res
        .send(sendResponse(false, null, "This Email is Already Exist"))
        .status(403);
    } else {
      await sendEmail(
        email,
        "A Token sent for confirming registration of the user in ABC App. Remember the token will expire after an hour.",
        `Here is Your confirmation Token ${token}`
      );
      userModel
        .create(obj)
        .then((result) => {
          console.log(result);
          (obj.resettoken = null),
            (obj.resettokenExpiration = null),
            res
              .send(
                sendResponse(
                  true,
                  result,
                  `A Confirmation Email sent to ${email} with a Token to confirm user registration`
                )
              )
              .status(200);
        })
        .catch((err) => {
          res
            .send(sendResponse(false, err, "Internal Server Error"))
            .status(400);
        });
    }
  }
};

module.exports = handleUser;
