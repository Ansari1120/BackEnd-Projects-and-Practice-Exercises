const { decode } = require("jsonwebtoken");
const sendResponse = require("../Helper/Helper");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
};

module.exports = AuthController;
