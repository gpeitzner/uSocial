const express = require("express");
const publishController = require("../controllers/publish.controller");
const router = express.Router();

router.post("/publish/", publishController.createPublish);

module.exports = router;
