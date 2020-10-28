const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  accessKeyId: "AKIAZGKNALCR52N7LIUG",
  secretAccessKey: "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",
});
const RKG = new AWS.Rekognition({
  accessKeyId: "AKIAZGKNALCR6FPR4VDZ",
  secretAccessKey: "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",
});
const TRANSLATE = new AWS.Translate({
  accessKeyId: "AKIAZGKNALCR6FPR4VDZ",
  secretAccessKey: "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",
});
const publishSchema = require("../models/publish");
const user = require("./user.controllers");
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

function getTags(name) {
  return new Promise((resolve, reject) => {
    const params = {
      Image: {
        S3Object: {
          Bucket: "pro2-g16",
          Name: "publications/" + name,
        },
      },
      MaxLabels: 123,
      MinConfidence: 70,
    };
    RKG.detectLabels(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function translate(tag) {
  return new Promise((resolve, reject) => {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "es-MX",
      Text: tag,
    };
    TRANSLATE.translateText(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

publish.createPublish = async (req, res) => {
  const { username, avatar, image64, text } = req.body;
  const imageName = Date.now() + ".PNG";
  try {
    const image = await uploadImageToS3(imageName, image64);
    const tags = await getTags(imageName);
    let finalTags = [];
    for (let i = 0; i < tags.Labels.length; i++) {
      const tag = tags.Labels[i];
      const finalTag = await translate(tag.Name);
      finalTags.push(finalTag.TranslatedText);
    }
    const newPublish = new publishSchema({
      username: username,
      avatar: avatar,
      image: image,
      tags: finalTags,
      text: text,
    });
    const result = await newPublish.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ error: "something go wrong" });
  }
};

module.exports = publish;
