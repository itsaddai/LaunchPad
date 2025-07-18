require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const appRoutes = require('./routes/applications');
const { OpenAI } = require("openai");
const authenticate = require("./middleware/auth");
const profileRoutes = require('./routes/profile');
const coverLetterRoutes = require('./routes/coverLetter');
const rateLimit = require('express-rate-limit');
const passport = require("passport");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

//openai config
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
// middleware

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// routes
app.get('/api/auth/google', (req, res) => {
  res.send('Google Auth Route Works!');
});
app.use(passport.initialize());
app.use('/api/applications', appRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/generate", coverLetterRoutes);
app.use('/api/profile', profileRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
  console.log('MongoDB connected successfully ✅');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅ `);
  });
})
.catch((err) => {
  console.error('MongoDB connection error ❌:', err);
});