const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/user/list
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select('username _id role');
        const onlineUsers = req.app.get('onlineUsers') || new Set();
        const usersWithOnline = users.map(user => ({
            _id: user._id,
            username: user.username,
            role: user.role,
            online: onlineUsers.has(user._id.toString())
        }));

        res.json({
            success: true,
            count: users.length,
            data: { users: usersWithOnline }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};

module.exports = {
    getAllUsers
}; 