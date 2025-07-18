require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const appRoutes = require('./routes/applications');
const { OpenAI } = require("openai");
const profileRoutes = require('./routes/profile');
const coverLetterRoutes = require('./routes/coverLetter');
const passport = require("passport");
require("./config/passport");

const app = express();

// OpenAI config (optional, only if needed here)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/api/applications', appRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/generate", coverLetterRoutes);
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("Mongo error ❌", err));

module.exports = app;
