const Profile = require("../models/Profile");

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "No profile found for this user" });
    }
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const saveProfile = async (req, res) => {
  const { fullName, email, phoneNumber, linkedin } = req.body;

  const profileFields = { user: req.user.id, fullName, email, phoneNumber, linkedin };

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // create new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, saveProfile };
