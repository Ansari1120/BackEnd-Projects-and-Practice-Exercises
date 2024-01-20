var dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Import the 'fs' module to work with the file system
const multer = require("multer");
const path = require("path");

// Multer storage configuration (memory storage)
const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imageBuffer) => {
  try {
    // Create the 'uploads' directory if it doesn't exist
    const tmpDir = path.join(__dirname, "tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    // Create a temporary file with a random name and write the buffer to it
    const tempFilePath = path.join(
      tmpDir,
      `${Math.random().toString(36).substring(2)}.png`
    );
    await fs.writeFile(tempFilePath, imageBuffer);

    // Upload the temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto",
    });

    // Delete the temporary file
    await fs.unlink(tempFilePath);

    // Return the Cloudinary URL as a response
    return result.secure_url;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Image upload Failed !");
  }
};

module.exports = uploadImage;
