const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// --- Validation Rules ---
// These rules are checked by the validation middleware in your routes

exports.signupValidationRules = () => {
  return [
    body('username', 'Username is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ];
};

exports.loginValidationRules = () => {
  return [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ];
};

// --- Controller Functions ---

/**
 * Generate JWT
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists (by email or username)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, errors: [{ msg: 'User with this email already exists' }] });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Username is already taken' }] });
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
    });

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Invalid credentials' }] });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: [{ msg: 'Invalid credentials' }] });
    }

    // Create token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  // User is already available from req.user set by the protect middleware
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};