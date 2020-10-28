const express = require("express");
const friendController = require("../controllers/friend.controller");
const router = express.Router();

router.post("/friend/", friendController.addFriend);

module.exports = router;
