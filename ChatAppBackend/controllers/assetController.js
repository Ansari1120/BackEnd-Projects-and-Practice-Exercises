var dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Import the 'fs' module to work with the file system
const multer = require("multer");
const path = require("path");

// Multer storage configuration (memory storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDNAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: `No Image Selected to Upload`,
        data: null,
      });
    }
    // Create the 'uploads' directory if it doesn't exist
    const tmpDir = path.join(__dirname, "tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    // Create a temporary file with a random name and write the buffer to it
    const tempFilePath = path.join(
      tmpDir,
      `${Math.random().toString(36).substring(2)}`
    );
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Upload the temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto",
    });

    // Delete the temporary file
    await fs.unlink(tempFilePath);

    // Return the Cloudinary URL as a response
    // return result.secure_url;
    // const signedUrl = cloudinary.url(result.url, {
    //   sign_url: true,
    //   secure: true,
    // });
    return res.status(200).json({
      status: 200,
      message: "Your Asset uploaded to the Cloud Successfully.",
      data: result.secure_url,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: `Something Went Wrong. ${error}`,
      data: null,
    });
    console.error("Error sending message:", error);
    throw new Error("Image upload Failed !");
  }
};

module.exports = uploadAsset;
