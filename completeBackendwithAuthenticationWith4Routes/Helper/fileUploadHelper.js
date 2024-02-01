const multer = require("multer");
const path = require("path");
const fs = require("fs");
var dotenv = require("dotenv");
dotenv.config();

// // Serve static files from the "storage" directory

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the file type from the mimetype
    const fileType = file.mimetype.split("/")[0];

    // Create a subdirectory based on file type
    const uploadPath = path.join("./storage/", `${fileType}/`);

    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("uploaded path when creating disk storage", uploadPath);
    // Set the destination path
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploader = multer({ storage: storage });

const HandleFileUpload = async (req, res, next) => {
  const files = req.files;
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";

  if (!files || files.length === 0) {
    return {
      success: false,
      files: null,
      message: "Files are not uploaded",
    };
  }

  if (files.length === 1) {
    const file = files[0];
    const fileType = file.mimetype.split("/")[0];
    const fileUrl = `${baseUrl}/storage/${fileType}/${file.filename}`;

    return {
      success: true,
      files: fileUrl,
      message: "File Uploaded Successfully.",
    };
  }

  const fileUrls = files.map((file) => {
    const fileType = file.mimetype.split("/")[0];
    return `${baseUrl}/storage/${fileType}/${file.filename}`;
  });

  return {
    success: true,
    files: fileUrls,
    message: "Files Uploaded Successfully.",
  };
};

module.exports = {
  uploader,
  HandleFileUpload,
};
