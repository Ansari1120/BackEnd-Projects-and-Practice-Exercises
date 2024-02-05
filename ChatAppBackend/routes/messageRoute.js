const express = require("express");
const protectRoute = require("../middleware/autMiddleware");
const { sendMessage, allMessage } = require("../controllers/messageController");
const router = express.Router();

router.route("/").post(protectRoute, sendMessage);
router.route("/:chatId").get(protectRoute, allMessage);

module.exports = router;
