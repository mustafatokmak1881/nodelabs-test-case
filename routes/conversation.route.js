const express = require('express');
const router = express.Router();

// Import controllers
const { getUserConversations } = require('../controllers/messageController');

// Import middleware
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(protect);

// Conversation routes
router.get('/', getUserConversations);

module.exports = router; 