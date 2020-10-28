const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  accessKeyId: "AKIAZGKNALCR52N7LIUG",
  secretAccessKey: "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",
});
const publishSchema = require("../models/publish");
const publish = {};

function uploadImageToS3(imageName, image64) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(image64, "base64");
    const imagePath = "publications/" + imageName;
    const params = {
      Bucket: "pro2-g16",
      Key: imagePath,
      Body: buffer,
      ACL: "public-read",
    };
    S3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

publish.createPublish = async (req, res) => {
  const { username, avatar, image64, text } = req.body;
  uploadImageToS3(Date.now() + ".PNG", image64)
    .then((image) => {
      console.log(image);
      res.json({ image: image });
    })
    .catch((error) => {
      console.log(error);
      res.json({ message: "hola perro" });
    });
};

module.exports = publish;
