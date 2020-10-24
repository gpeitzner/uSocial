const { s3 } = require('../config/S3')
module.exports = function (body) {
    let picture = body.image.substring(22, body.image.lentgh);
    //picture insertions
    //decodificacion de imagen
    let decode = Buffer.from(picture, 'base64')
    let Name = body.user + '.png'

    //creacion de objeto para carga de s3
    let bucket = 'pro2-g16/users'

    let upload = {
        Bucket: bucket,
        Key: Name,
        Body: decode,
        ACL: 'public-read'
    }

    //carga de imagen
    s3.upload(upload, function (err, data) {
        if (err) {
            console.log(err)
        }
    })

    return Name
}