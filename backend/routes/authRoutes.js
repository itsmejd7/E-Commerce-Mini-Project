const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Signup Route (roles: user or seller)
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  console.log('Signup request:', { name, email, role }); // Debug log

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with chosen role
  const userRole = role === 'seller' ? 'seller' : 'user';
  console.log('Creating user with role:', userRole); // Debug log
  
  const newUser = new User({ name, email, password: hashedPassword, role: userRole });
  await newUser.save();
  
  console.log('User created:', newUser); // Debug log

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

  res.status(201).json({ token, user: newUser });
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

  res.json({ token });
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Become seller: upgrade current user role to seller
router.post('/become-seller', authenticate, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user, { role: 'seller' }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update role' });
  }
});

module.exports = router;
