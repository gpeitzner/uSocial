const express = require("express");
const publishController = require("../controllers/publish.controller");
const router = express.Router();

router.post("/publish/", publishController.createPublish);
router.get("/publish/", publishController.getPublications);

module.exports = router;
