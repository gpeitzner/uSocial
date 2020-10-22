const express = require('express');
const controller = require('../controllers/user.controllers');
const router = express.Router();

router.get('/', controller.getusers);
router.post('/addUser', controller.createUser);
module.exports = router;