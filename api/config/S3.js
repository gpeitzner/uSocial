const aws = require('aws-sdk')
module.exports = {
    s3 : new aws.S3({                     //credenciales de mi usuario administrador con accesos a servicios de s3
        apiVersion: '2006-03-01',
        region: 'us-east-2',
        accessKeyId: 'AKIAZGKNALCR52N7LIUG',
        secretAccessKey: '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'})
}