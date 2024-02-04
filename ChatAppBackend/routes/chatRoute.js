const express = require("express");
const router = express.Router();
const protect = require("../middleware/autMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

router.route("/").get(protect, fetchChats);
router.route("/").post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);
router.route("/addToGroup").put(protect, addToGroup);
router.route("/renameGroup").put(protect, renameGroup);
router.route("/removeFromGroup").put(protect, removeFromGroup);

module.exports = router;
