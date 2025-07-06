const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/refresh', protect, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;