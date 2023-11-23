const sendResponse = require("../Helper/Helper");
const teamModel = require("../models/teamModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Import the 'fs' module to work with the file system

const Controller = {
  getTeam: async (req, res) => {
    try {
      let { page, limit, sort, asc, userId } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 40;

      const skip = (page - 1) * limit;
      // Create a filter object based on the optional DueDate parameter

      const filter = {};

      if (userId) {
        // Assuming userId is provided as a string in the request query
        filter.CreatorUserID = userId;
      }

      const result = await teamModel
        .find(filter)
        .sort({ [sort]: asc })
        .skip(skip)
        .limit(limit);

      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, result, "Data Found", "", page, limit))
          .status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(500); // Changed status code to 500 for server error
    }
  },
  postTeam: async (req, res) => {
    const { Name, Logo, TeamMembers, CreatorUserID } = req.body;
    try {
      let errArr = [];
      if (!Name) {
        errArr.push("Name is Required !");
      }
      if (!Logo) {
        errArr.push("Logo is Required !");
      }
      if (!TeamMembers) {
        errArr.push("TeamMembers is Required !");
      }
      if (!CreatorUserID) {
        errArr.push("CreatorUserID is Required !");
      }
      if (errArr.length > 0) {
        return res
          .send(sendResponse(false, errArr, "Required All Fields"))
          .status(404);
      } else {
        let obj = { Name, Logo, TeamMembers, CreatorUserID };
        let team = new teamModel(obj);
        await team.save();
        if (!team) {
          return res
            .send(sendResponse(false, null, "Data not found"))
            .status(404);
        } else {
          res
            .send(sendResponse(true, team, "Team Data Added Sucessfully"))
            .status(400);
        }
      }
    } catch (error) {
      console.log(error);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res
          .send(sendResponse(false, null, "No Image Selected to Upload"))
          .status(400);
      }

      // Create a temporary file with a random name and write the buffer to it
      const tempFilePath = `/tmp/${Math.random().toString(36).substring(2)}`;
      await fs.writeFile(tempFilePath, req.file.buffer);

      // Upload the temporary file to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "auto",
      });

      // Delete the temporary file
      await fs.unlink(tempFilePath);

      // Return the Cloudinary URL as a response
      res
        .status(200)
        .send(
          sendResponse(
            false,
            result,
            `Image Uploaded Successfully: ${result.secure_url}`
          )
        );
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  },
};

module.exports = Controller;
