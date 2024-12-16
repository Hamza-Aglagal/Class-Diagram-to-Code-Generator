const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      email,
    });

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Check password
    if (password !== user.password) {
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

module.exports = router;
