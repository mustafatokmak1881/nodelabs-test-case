const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

// Protected routes (Admin only)
router.get('/list', protect, authorize('admin'), getAllUsers);

module.exports = router; 