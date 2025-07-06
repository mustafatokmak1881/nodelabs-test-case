const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Ensure participants array has at least 2 users and no duplicates
conversationSchema.pre('save', function(next) {
    if (this.participants.length < 2) {
        return next(new Error('Conversation must have at least 2 participants'));
    }
    
    // Remove duplicates
    this.participants = [...new Set(this.participants)];
    
    next();
});

// Index for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Method to check if user is participant
conversationSchema.methods.isParticipant = function(userId) {
    return this.participants.includes(userId);
};

// Method to get other participant (for 1-on-1 conversations)
conversationSchema.methods.getOtherParticipant = function(userId) {
    return this.participants.find(participant => 
        participant.toString() !== userId.toString()
    );
};

module.exports = mongoose.model('Conversation', conversationSchema); 