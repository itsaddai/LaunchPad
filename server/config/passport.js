const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User"); // or however you store users
const findOrCreate = require("mongoose-findorcreate");
const crypto = require("crypto");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      // new user registering thru google
      user = new User({
        fullName: profile.displayName,
        email: email,
        password: crypto.randomBytes(20).toString('hex'),
      });
      await user.save();
      console.log("🆕 New user created via Google:", user.email);
    } else {
      console.log("👤 Existing user logged in via Google:", user.email);
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      // new user registering using github
      user = new User({
        fullName: profile.displayName || profile.username,
        email: email,
        password: crypto.randomBytes(20).toString('hex'),
      });
      await user.save();
      console.log("🆕 New user created via GitHub:", user.email);
    } else {
      console.log("👤 Existing user logged in via GitHub:", user.email);
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

