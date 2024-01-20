const express = require("express");
const route = express.Router();
const sendResponse = require("../Helper/Helper");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AuthController = require("../Controller/authController");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var dotenv = require("dotenv");
dotenv.config();
const authMiddleware = require("../Helper/middleware");

// Multer storage configuration (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

route.get("/test", AuthController.protected);
route.post("/signup", AuthController.registerUser);
route.post("/login", AuthController.login);
route.use(authMiddleware);
route.get("/", AuthController.getUsers);
route.post("/confirmUserRegistration", AuthController.confirmRegistration);
route.post("/");
route.post("/upload", upload.single("image"), AuthController.uploadImage);
route.post("/changePassword", AuthController.changePassword);
route.post("/forgotPassword", AuthController.forgotPassword);
route.post("/resetPassword", AuthController.resetPassword);
route.post("/deleteUser/:id", AuthController.deleteUser);
route.put("/:id", AuthController.editProfile);

module.exports = route;
