const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const crypto = require("crypto");

// register controller
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    console.log("📥 Received data:", { fullName, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(" User already exists ⚠️: ", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log(" User created successfully!:", newUser);
    
    // return token after registration
    const login = (token, userData) => {
  setToken(token);
  setUser(userData);
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
  };
    
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser._id, name: newUser.fullName, email: newUser.email },
      token
    });

  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
