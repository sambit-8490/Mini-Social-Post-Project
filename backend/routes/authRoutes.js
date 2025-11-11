const express = require('express');
const { 
  signup, 
  login, 
  getMe, 
  signupValidationRules, 
  loginValidationRules 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/signup', 
  signupValidationRules(), 
  handleValidationErrors, 
  signup
);

router.post(
  '/login', 
  loginValidationRules(), 
  handleValidationErrors, 
  login
);

router.get('/me', protect, getMe);

module.exports = router;