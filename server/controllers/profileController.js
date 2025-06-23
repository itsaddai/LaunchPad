// controllers/profileController.js
const Profile = require("../models/Profile");

const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });
  res.json(profile);
};

const saveProfile = async (req, res) => {
  const { fullName, title, summary, skills, education, experience, projects } = req.body;
  const profileFields = { user: req.user.id, fullName, title, summary, skills, education, experience, projects };

  let profile = await Profile.findOne({ user: req.user.id });
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );
    return res.json(profile);
  }

  profile = new Profile(profileFields);
  await profile.save();
  res.json(profile);
};

module.exports = { getProfile, saveProfile };
