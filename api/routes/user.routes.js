const express = require('express');
const userControllers = require('../controllers/user.controllers');
const router = express.Router();

router.get('/', userControllers.getusers);
router.post('/addUser', userControllers.createUser);
module.exports = router;