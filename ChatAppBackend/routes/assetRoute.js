const express = require("express");
const protectRoute = require("../middleware/autMiddleware");
const uploadAsset = require("../controllers/assetController");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
var dotenv = require("dotenv");
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//front end upload instructions : set headers multipart/formdata.
//use var form = new formData() and append it assets to upload

router.post("/uploadAsset", upload.single("asset"), uploadAsset);

module.exports = router;
