const express = require('express');
const userControllers = require('../controllers/user.controllers');
const router = express.Router();

router.get('/', userControllers.getusers);
router.post('/user/registrer', userControllers.createUser);
router.get('/user/:_id', userControllers.getOneUser);
module.exports = router;
