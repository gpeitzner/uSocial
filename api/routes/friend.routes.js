const express = require("express");
const friendController = require("../controllers/friend.controller");
const router = express.Router();

router.post("/friend/", friendController.addFriend);
router.get("/friend/unknows/:id", friendController.listUnknows);
router.get("/friend/knows/:id", friendController.listKnows);

module.exports = router;
