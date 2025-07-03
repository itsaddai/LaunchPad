const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName:  String,
  title:     String,
  summary:   String,
  skills:    [String],
  education: [
    {
      school: String,
      degree: String,
      startMonth: String,
      startYear: String,
      endMonth: String,
      endYear: String
    }],
  experience: [
    {
      title: String,
      company: String,
      dateRange: String,
      bullets: [String]
    }
  ],
  projects: [String]
});

module.exports = mongoose.model("Profile", ProfileSchema);
