const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName:  String,
  email:     String,
  phoneNumber:   String,
  linkedin: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
