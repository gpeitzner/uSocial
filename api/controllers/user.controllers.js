const userSchema = require('../models/user');

const user = {};

//get user 
user.getusers = async (req, res) => {    
    const user = await userSchema.find();
    res.json(user);
};

//create user
user.createUser = async (req, res) => {
    const newUser = new userSchema({
        name: req.body.name,
        user: req.body.user,
        password: req.body.password,
        image: req.body.image,
        modeBot: false
    });

    await newUser.save();
    res.json({
        status: 'User created'
    })
};

module.exports = user;