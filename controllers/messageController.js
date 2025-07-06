const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Send a new message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { conversationId, content, recipientId } = req.body;
        const senderId = req.user.id;

        // Validate input
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        let conversation;

        // If conversationId is provided, use existing conversation
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
            
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            // Check if user is participant
            if (!conversation.isParticipant(senderId)) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not a participant in this conversation'
                });
            }
        } else {
            // Create new conversation if recipientId is provided
            if (!recipientId) {
                return res.status(400).json({
                    success: false,
                    message: 'Either conversationId or recipientId is required'
                });
            }

            // Check if recipient exists
            const recipient = await User.findById(recipientId);
            if (!recipient) {
                return res.status(404).json({
                    success: false,
                    message: 'Recipient not found'
                });
            }

            // Check if conversation already exists between these users
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, recipientId] },
                isActive: true
            });

            if (!conversation) {
                // Create new conversation
                conversation = new Conversation({
                    participants: [senderId, recipientId]
                });
                await conversation.save();
            }
        }

        // Create message
        const message = new Message({
            conversationId: conversation._id,
            sender: senderId,
            content: content.trim()
        });

        await message.save();

        // Update conversation's last message
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        // Populate sender info for response
        await message.populate('sender', 'username');

        res.status(201).json({
            success: true,
            data: {
                message: {
                    id: message._id,
                    content: message.content,
                    sender: message.sender,
                    conversationId: message.conversationId,
                    isRead: message.isRead,
                    createdAt: message.createdAt
                },
                conversation: {
                    id: conversation._id,
                    participants: conversation.participants
                }
            }
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending message'
        });
    }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        const { page = 1, limit = 50 } = req.query;

        // Validate conversationId
        if (!conversationId || !conversationId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation ID'
            });
        }

        // Check if conversation exists and user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!conversation.isParticipant(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this conversation'
            });
        }

        // Get messages with pagination
        const skip = (page - 1) * limit;
        const messages = await Message.find({ conversationId })
            .populate('sender', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const totalMessages = await Message.countDocuments({ conversationId });

        res.json({
            success: true,
            data: {
                messages: messages.reverse(), // Show oldest first
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalMessages / limit),
                    totalMessages,
                    hasNext: skip + messages.length < totalMessages,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get conversation messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching messages'
        });
    }
};

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        // Get conversations where user is participant
        const conversations = await Conversation.find({
            participants: userId,
            isActive: true
        })
        .populate('participants', 'username')
        .populate('lastMessage', 'content sender createdAt')
        .sort({ lastMessageAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        // Get total count
        const totalConversations = await Conversation.countDocuments({
            participants: userId,
            isActive: true
        });

        // Format response
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(p => 
                p._id.toString() !== userId
            );

            return {
                id: conv._id,
                otherParticipant: {
                    id: otherParticipant._id,
                    username: otherParticipant.username
                },
                lastMessage: conv.lastMessage ? {
                    id: conv.lastMessage._id,
                    content: conv.lastMessage.content,
                    sender: conv.lastMessage.sender,
                    createdAt: conv.lastMessage.createdAt
                } : null,
                lastMessageAt: conv.lastMessageAt,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt
            };
        });

        res.json({
            success: true,
            data: {
                conversations: formattedConversations,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalConversations / limit),
                    totalConversations,
                    hasNext: skip + conversations.length < totalConversations,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get user conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching conversations'
        });
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        // Validate messageId
        if (!messageId || !messageId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid message ID'
            });
        }

        // Find message and populate conversation
        const message = await Message.findById(messageId)
            .populate({
                path: 'conversationId',
                select: 'participants'
            });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Check if user is participant in the conversation
        if (!message.conversationId.isParticipant(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this conversation'
            });
        }

        // Check if message is already read
        if (message.isRead) {
            return res.json({
                success: true,
                message: 'Message is already marked as read',
                data: { message }
            });
        }

        // Mark as read
        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        res.json({
            success: true,
            message: 'Message marked as read',
            data: { message }
        });

    } catch (error) {
        console.error('Mark message as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking message as read'
        });
    }
};

module.exports = {
    sendMessage,
    getConversationMessages,
    getUserConversations,
    markMessageAsRead
}; 