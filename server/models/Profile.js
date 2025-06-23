// models/Profile.js
const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String,
  title: String,
  summary: String,
  skills: String,
  education: String,
  experience: String,
  projects: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
