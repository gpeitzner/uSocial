const userSchema = require('../models/user');

//creamos objeto employe y los metodos que este contendre CRUD
const user = {};

//get user 
user.getusers = async (req, res) => {    
    const user = await userSchema.find();
    res.json(user);
};

module.exports = user;