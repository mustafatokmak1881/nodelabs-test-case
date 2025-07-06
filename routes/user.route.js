const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

// Protected routes (All authenticated users)
router.get('/list', protect, getAllUsers);

module.exports = router; 