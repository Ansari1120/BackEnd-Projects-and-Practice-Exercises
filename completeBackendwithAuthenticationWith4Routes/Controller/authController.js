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
  registerUser:async(req,res)=>{
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

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res
        .send(sendResponse(false, null, "This Email is Already Exist"))
        .status(403);
    } else {
      userModel.create(obj)
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
  },
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
      res.send(sendResponse(false, null, "User Doesn't Exist"));
    }
  },
  getUsers: async (req, res) => {
    userModel
      .find()
      .then((result) => {
        res.send(sendResponse(true, result));
      })
      .catch((err) => {
        console.log(err);
        res.send(sendResponse(false, err, "Failed to retrieve users"));
      });
  },
  protected: async (req, res, next) => {
    //check if user with the provided token exist?
    //and return response in the api with decoded user info
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
        //the scenario is handled as token is valid for 24 hours
        //if token's date and time object is earlier (>)
        //then the current date an time then user's token is proven
        //to be valid as per 24 hrs setteld in jwt. otherwise it is
        //clear that token is expired and password cannot be reset.
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
  editProfile: async (req, res) => {
    try {
      let id = req.params.id;
      let { userName, avatar, email } = req.body;
      let result = await userModel.findById(id);
      if (!result) {
        return res
          .status(404)
          .send(
            sendResponse(false, null, "User not found with the given params id")
          );
      } else {
        if (!avatar || avatar === "") {
          avatar =
            "https://extendedevolutionarysynthesis.com/wp-content/uploads/2018/02/avatar-1577909_960_720.png";
        }
        let updateProfile = await userModel.findByIdAndUpdate(
          id,
          { userName, avatar, email },
          { new: true }
        );
        if (!updateProfile) {
          return res
            .status(400)
            .send(
              sendResponse(
                false,
                null,
                "Something went wrong while updating user credentials, kindly recheck payload key values type and key spelling."
              )
            );
        } else {
          return res
            .status(200)
            .send(
              sendResponse(
                true,
                updateProfile,
                "Credentials Updated Successfully!"
              )
            );
        }
      }
    } catch (error) {
      return res
        .status(500)
        .send(sendResponse(false, null, "Internal Server Error"));
    }
  },
};

module.exports = AuthController;
