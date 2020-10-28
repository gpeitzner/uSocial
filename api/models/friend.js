const mongoose = require("mongoose");
const { Schema } = mongoose;

const friendSchema = new Schema({
  username: { type: String, required: true },
  friend: { type: String, required: true },
});

const collectionName = "Amigo";
module.exports = mongoose.model("Amigo", friendSchema, collectionName);
