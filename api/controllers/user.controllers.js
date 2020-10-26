const userSchema = require('../models/user');
const cognito = require('../src/insertUserCognito');
const cogUpdate = require('../src/updateUserCognito')
const uploadImage = require('../src/insertPictureS3')
const user = {};
//get user 
user.getusers = async (req, res) => {
    //const user = await userSchema.find();
    //res.json(user);
    res.send("welcome to /")
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
    //https://pro2-g16.s3.us-east-2.amazonaws.com/users/testq123.jpeg    
    nameImage = uploadImage(req.body)
    const newUser = new userSchema({
        name: req.body.name,
        user: req.body.user,
        password: req.body.password,
        image: 'https://pro2-g16.s3.us-east-2.amazonaws.com/users/' + nameImage,
        modeBot: false
    });

    await newUser.save();
    cognito(req);  //insert cognito
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
            
    if (req.body.image[0] != 'h') {
        nameImage = uploadImage(req.body)
        req.body.image = 'https://pro2-g16.s3.us-east-2.amazonaws.com/users/' + nameImage
    }
    await userSchema.findByIdAndUpdate(req.params._id, { $set: req.body }, { new: true });
    cogUpdate(req);

    res.json({
        status: 'User has Updated'
    })
};

module.exports = user;
