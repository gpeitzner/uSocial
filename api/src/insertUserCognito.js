let aws = require('aws-sdk')
const cognito = require('../config/cognito')
aws.config.update(cognito.aws_remote_config)
const client = new aws.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-2"
})
module.exports = (req) => {
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
}