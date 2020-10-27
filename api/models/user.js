const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  user: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  modeBot: { type: Boolean },
});
const collectionName = "Usuario";
module.exports = mongoose.model("Usuario", userSchema, collectionName); //the collection name mongoose convert a plural example: Usuario -> usuarios
//that's why I force setting the name in singular by means of collectionName
