const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userControllers");
const protectRoute = require("../middleware/autMiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(protectRoute, allUsers);
router.route("/login").post(loginUser);

module.exports = router;
