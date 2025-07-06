const express = require('express');
const router = express.Router();

// Import controllers
const {
    sendMessage,
    getConversationMessages,
    getUserConversations,
    markMessageAsRead
} = require('../controllers/messageController');

// Import middleware
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(protect);

// Message routes
router.post('/send', sendMessage);
router.get('/:conversationId', getConversationMessages);
router.put('/:messageId/read', markMessageAsRead);

module.exports = router; 