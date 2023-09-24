const { decode } = require("jsonwebtoken");
const sendResponse = require("../Helper/Helper");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Helper/sendEmail");
const generateRandomToken = require("../Helper/randomToken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Import the 'fs' module to work with the file system

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const obj = { email, password };
    console.log(obj);
    let result = await userModel.findOne({ email });
    if (result) {
      let isConfirm = await bcrypt.compare(obj.password, result.password);
      if (isConfirm) {
        let token = jwt.sign({ ...result }, process.env.SECURE_KEY, {
          expiresIn: "24h",
        });
        res.send(
          sendResponse(true, { user: result, token }, "Login Successfully")
        );
      } else {
        res.send(sendResponse(false, null, "Credential Error"));
      }
    } else {
      res.send(sendResponse(false, err, "User Doesn't Exist"));
    }
  },
  getUsers: async (req, res) => {
    userModel
      .find()
      .then((result) => {
        res.send(sendResponse(true, result));
      })
      .catch((err) => {});
  },
  protected: async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, process.env.SECURE_KEY, (err, decode) => {
        if (err) {
          res.send(sendResponse(false, null, "Unauthorized")).status(403);
        } else {
          console.log(decode);
          next();
        }
      });
    } else {
      res.send(sendResponse(false, null, "Server internal Error")).status(400);
    }
  },
  adminProtected: async (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECURE_KEY, (err, decoded) => {
      if (err) {
        res.send(sendResponse(false, null, "Unauthorized")).status(403);
      } else {
        if (decoded._doc.isAdmin) {
          next();
        } else {
          res
            .send(sendResponse(false, null, "You Have Rights for this Action"))
            .status(403);
        }
      }
    });
  },
  changePassword: async (req, res) => {
    try {
      const { email, newPassword, oldPassword } = req.body;

      const user = await userModel.findOne({ email: email });

      if (user) {
        const passwordValid = bcrypt.compare(oldPassword, user.password);
        if (!passwordValid) {
          res
            .send(sendResponse(false, null, "Old Password is Wrong"))
            .status(404);
        }
        const newhashPassword = await bcrypt.hash(newPassword, 12);
        user.password = newhashPassword;
        await user.save();
        res.send(sendResponse(true, user, "Password is Changed !")).status(200);
      } else {
        res.send(sendResponse(false, null, "user not found !")).status(404);
      }
    } catch (error) {
      res.send(sendResponse(false, error, "Internal Server Error")).status(400);
    }
  },
  deleteUser: async (req, res) => {
    try {
      let id = req.params.id;
      const { email, password } = req.body;
      const user = await userModel.findById(id);
      if (user) {
        const passwordValid = bcrypt.compare(password, user.password);
        if (!passwordValid) {
          res
            .send(sendResponse(false, null, "Your Provided Password is Wrong"))
            .status(404);
        }
        const deleteUser = await userModel.findByIdAndDelete(id);

        if (!deleteUser) {
          res
            .send(sendResponse(false, null, "Error:Something Went Wrong"))
            .status(400);
        } else {
          res
            .send(sendResponse(true, deleteUser, "User Deleted SucessFully !"))
            .status(200);
        }
      } else {
        res
          .send(sendResponse(false, null, "No Data Found on this id"))
          .status(404);
      }
    } catch (error) {}
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
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const userExist = await userModel.findOne({ email });
      if (!userExist) {
        return res
          .send(
            sendResponse(
              false,
              null,
              "user with the provided email does not exist"
            )
          )
          .status(404);
      } else {
        const token = generateRandomToken(5);
        console.log(token);
        userExist.resettoken = token;
        userExist.resettokenExpiration = Date.now() + 3600000;
        await userExist.save();
        await sendEmail(
          email,
          "A Token send for Resetting Password for Trello App",
          `Here is Your Reset Token ${token}`
        );
        res
          .send(
            sendResponse(
              true,
              userExist,
              `A Confirmation Email send to ${email} with a Token to Reset Password`
            )
          )
          .status(200);
      }
    } catch (error) {
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token, email, newPassword } = req.body;

      const userExist = await userModel.findOne({ email });
      if (!userExist) {
        return res
          .send(
            sendResponse(
              false,
              null,
              "user with the provided email does not exist"
            )
          )
          .status(404);
      } else {
        if (userExist.resettoken !== token) {
          return res
            .send(sendResponse(false, null, "Enter Valid Token"))
            .status(404);
        }
        if (userExist.resettokenExpiration < new Date()) {
          return res
            .send(sendResponse(false, null, "Token has Expired"))
            .status(404);
        }
        if (userExist.password === newPassword) {
          return res
            .send(
              sendResponse(
                false,
                null,
                "This Password is Already Taken Try resending token email with different password"
              )
            )
            .status(404);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userExist.password = hashedPassword;
        userExist.resettoken = "";
        userExist.resettokenExpiration = null;
        await userExist.save();
        res
          .send(
            sendResponse(
              true,
              userExist,
              "Congratulations Password Reset Completed"
            )
          )
          .status(200);
      }
    } catch (error) {
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
};

module.exports = AuthController;
