const { s3 } = require('../config/S3')
module.exports = function (body) {

    let i = 0;
    while(true){
        if(body.image[i] == ','){
            break;
        }
        i++;
    }
    let picture = body.image.substring(i+1, body.image.lentgh);
    i = 11
    while(true){
        if(body.image[i] == ';'){
            break;
        }
        i++;
    }
    let type = body.image.substring(11, i);
    //picture insertions
    //decodificacion de imagen
    let decode = Buffer.from(picture, 'base64')
    let Name = body.user + '.' + type

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