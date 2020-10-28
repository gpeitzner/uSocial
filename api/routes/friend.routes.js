const express = require("express");
const friendController = require("../controllers/friend.controller");
const router = express.Router();

router.post("/friend/", friendController.addFriend);
router.get("/friend/:id", friendController.listUnknows);

module.exports = router;
