// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// middleware

dotenv.config();

// test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
// routes
app.use('/api/auth', authRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(' MongoDB connected successfully ✅');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅ `);
  });
})
.catch((err) => {
  console.error('MongoDB connection error ❌:', err);
});
