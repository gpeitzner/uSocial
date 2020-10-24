const userSchema = require('../models/user');
const cognito = require('../src/insertUserCognito');
const cogUpdate = require('../src/updateUserCognito')
const uploadImage = require('../src/insertPictureS3')
const user = {};
//get user 
user.getusers = async (req, res) => {
    const user = await userSchema.find();
    res.json(user);
};

user.getOneUser = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params._id);
        res.json(user)
    } catch (e) {
        res.status(403).send("Usuario no existe.")
    }
}

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
    cognito(req);  //insert cognito
    nameImage = uploadImage(req.body)
    res.json({
        status: 'User created'
    })
};

//edit user
user.updateUser = async (req, res) => {
    /*const newUser = new userSchema({
        name: req.body.name,
        user: req.body.user,
        password: req.body.password,
        image: req.body.image,
        modeBot: false
    });*/
    cogUpdate(req);
    nameImage = uploadImage(req.body)
    await userSchema.findByIdAndUpdate(req.params._id, { $set: req.body }, { new: true });

    res.json({
        status: 'User has Updated'
    })
};

module.exports = user;
