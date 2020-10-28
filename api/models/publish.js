const mongoose = require("mongoose");
const { Schema } = mongoose;

const publishSchema = new Schema({
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, required: true },
  tags: { type: [String] },
  text: { type: String },
});

const collectionName = "Publicacion";
module.exports = mongoose.model("Publicacion", publishSchema, collectionName);
