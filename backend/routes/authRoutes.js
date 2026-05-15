const express = require('express');
const {
  signup,
  login,
  logout,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require('../controllers/authController');
const { verifyAuth } = require('../middleware/verifyAuth');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/check-auth', verifyAuth, checkAuth);
router.put('/profile', verifyAuth, updateProfile);

module.exports = router;
