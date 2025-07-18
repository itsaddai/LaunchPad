const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const passport = require('passport');
const { createJWT } = require('../utils/jwt'); // Assuming you have a utility to create JWTs

const jwt = require('jsonwebtoken');
router.post('/register', register);
router.post('/login', login);

//google auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, 
  }),
  (req, res) => {

    const token = createJWT(req.user); // fetch JWT logic
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);

// github auth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = createJWT(req.user); // fetch JWT logic
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);



module.exports = router;