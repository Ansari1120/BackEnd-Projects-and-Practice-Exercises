const express = require("express");
const route = express.Router();
const Controller = require("../Controller/teamController");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Multer storage configuration (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dh0qyygrv",
  api_key: "733256674134826",
  api_secret: "Pk-JvJt0VmtKjucERG5Feah1wos",
});

route.get("/", Controller.getTeam);
route.post("/", Controller.postTeam);
route.post("/upload", upload.single("image"), Controller.uploadImage);

module.exports = route;
