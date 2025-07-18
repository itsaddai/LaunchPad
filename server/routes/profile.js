const express = require("express");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

const router = express.Router();

// important user middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// fetch profile (GET)
router.get("/", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId }); 
    if (!profile) {
  return res.status(404).json({ error: "Profile not found" });
}
res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST/PUT profile
router.post("/", authenticate, async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.userId }); 

    if (existing) {
      // Update
      const updated = await Profile.findOneAndUpdate(
        { user: req.userId },            
        { ...req.body },
        { new: true }
      );
      res.json(updated);
    } else {
      // Create
      const newProfile = new Profile({ user: req.userId, ...req.body }); 
      await newProfile.save();
      res.json(newProfile);
    }
  } catch (err) {
    console.error("POST /api/profile error:", err);  // debugging
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;
