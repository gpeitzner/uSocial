const userSchema = require('../models/user');
let aws = require('aws-sdk')
const cognito = require('../config/cognito')

const user = {};

aws.config.update(cognito.aws_remote_config)
const client = new aws.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-2"
})

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

    //CREATE USER IN COGNITO
    console.log(req.body)
    var poolData = {
        UserPoolId: "us-east-2_BUSOUKHvw",
        Username: req.body.name,
        UserAttributes: [
            {
                Name: "name",
                Value: req.body.name
            },
            {
                Name: "nickname",
                Value: req.body.user
            },
            {
                Name: "custom:password",
                Value: req.body.password
            }
        ]
    };
    client.adminCreateUser(poolData, (error, data) => {
        if(error){
            console.log(error);
        }else{
            console.log(data);      
        }
    });

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

    await userSchema.findByIdAndUpdate(req.params._id, { $set: req.body }, { new: true });

    res.json({
        status: 'User has Updated'
    })
};

module.exports = user;
