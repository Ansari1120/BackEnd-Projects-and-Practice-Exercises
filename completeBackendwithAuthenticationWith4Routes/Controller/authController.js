const { decode } = require("jsonwebtoken");
const sendResponse = require("../Helper/Helper");
const userModel = require("../models/userModel");
const imageUpload = require("../Helper/uploadImageToServer");
const handleUserRegister = require("../Helper/registerUserDynamicHandling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Helper/sendEmail");
const sendSMS = require("../Helper/sendSms");
const generateRandomToken = require("../Helper/randomToken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Import the 'fs' module to work with the file system
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");

const AuthController = {
  registerUser: async (req, res) => {
    try {
      const contentType = req.headers["content-type"];

      if (contentType.includes("multipart/form-data")) {
        // Handle 'multipart/form-data' (file upload)
        upload.single("avatar")(req, res, async (err) => {
          if (err) {
            return res
              .status(400)
              .send(sendResponse(false, null, "File upload failed"));
          }

          // Check if an image file is present in the request
          if (req.file) {
            const avatarUrl = await imageUpload(req.file.buffer);
            req.body.avatar = avatarUrl;
          }

          // Continue with user registration logic (JSON data or with updated avatar URL)
          await handleUserRegister(req, res);
        });
      } else if (contentType.includes("application/json")) {
        // Handle 'application/json' (JSON data)
        // Assuming the JSON payload is in the request body
        req.body.avatar =
          "https://extendedevolutionarysynthesis.com/wp-content/uploads/2018/02/avatar-1577909_960_720.png"; // Set a default avatar URL if needed

        // Continue with user registration logic (JSON data or with default avatar URL)
        await handleUserRegister(req, res);
      } else {
        // Unsupported content type
        res
          .status(400)
          .send(sendResponse(false, null, "Unsupported Content-Type"));
      }
    } catch (error) {
      res
        .status(500)
        .send(sendResponse(false, null, "User registration failed"));
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const obj = { email, password };
    console.log(obj);
    let result = await userModel.findOne({ email });
    if (!result.registrationStatus) {
      res.send(
        sendResponse(false, null, "Please Confirm Registration of User First.")
      );
    }
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
  confirmRegistration: async (req, res) => {
    try {
      const { token, email } = req.body;
      const userExist = await userModel.findOne({ email });
      if (!userExist) {
        return res
          .send(
            sendResponse(
              false,
              null,
              "Please provide the same email you used for registring this account."
            )
          )
          .status(404);
      } else {
        if (userExist.resettoken !== token) {
          console.log("saved one", userExist.resettoken, "input one", token);
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
        if (userExist.registrationStatus) {
          return res
            .send(
              sendResponse(
                false,
                null,
                "Your Account registration is already confirmed"
              )
            )
            .status(404);
        }
        userExist.registrationStatus = true;
        userExist.resettoken = "";
        userExist.resettokenExpiration = null;
        await userExist.save();
        res
          .send(
            sendResponse(
              true,
              userExist,
              "Congratulations Account Registraion Completed,now you can login to ABC App."
            )
          )
          .status(200);
      }
    } catch (error) {
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  getUsers: async (req, res) => {
    userModel
      .find()
      .then((result) => {
        res.send(sendResponse(true, result)).status(200);
      })
      .catch((err) => {
        console.log(err);
        res
          .send(sendResponse(false, err, "Failed to retrieve users"))
          .status(404);
      });
  },
  protected: async (req, res, next) => {
    // Check if a user with the provided token exists
    // and return the response in the API with decoded user info

    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, process.env.SECURE_KEY, (err, decode) => {
        if (err) {
          return res
            .send(sendResponse(false, null, "Unauthorized"))
            .status(403);
        } else {
          console.log(decode);
          res.send(sendResponse(true, decode, "Authorized")).status(200);
        }
      });
    } else {
      res.status(400).send(sendResponse(false, null, "Server internal Error"));
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
      let token = req.headers.authorization;
      const { email, newPassword, oldPassword } = req.body;
      const user = await userModel.findOne({ email: email });

      if (token) {
        token = token.split(" ")[1];
        jwt.verify(token, process.env.SECURE_KEY, async (err, decode) => {
          if (err) {
            res.send(sendResponse(false, null, "Unauthorized")).status(403);
          } else {
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
              res
                .send(sendResponse(true, user, "Password is Changed !"))
                .status(200);
            } else {
              res
                .send(sendResponse(false, null, "user not found !"))
                .status(404);
            }
          }
        });
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

      // Create the 'tmp' directory if it doesn't exist
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
      const { email, number, mode } = req.body;
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
        if (!mode) {
          return res
            .send(
              sendResponse(
                false,
                null,
                "please select mode of send verification token, either sms or email"
              )
            )
            .status(404);
        }
        if (mode == "email") {
          await sendEmail(
            email,
            "A Token sent for Resetting Password for Abc App",
            `Here is Your Reset Token ${token}`
          );
        } else {
          if (!number) {
            return res
              .send(sendResponse(false, null, "Fill the number field"))
              .status(404);
          }
          console.log("here is number");
          await sendSMS(
            number,
            "A Token sent for Resetting Password for ABC App",
            `Here is Your Reset Token ${token}`
          );
        }
        (userExist.resettoken = null),
          (userExist.resettokenExpiration = null),
          res
            .send(
              sendResponse(
                true,
                userExist,
                `A Confirmation ${mode === "email" ? "email" : "sms"} send to ${
                  mode === "email" ? email : number
                } with a Token to Reset Password`
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
