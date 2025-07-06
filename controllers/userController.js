const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/user/list
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('username -_id');

        res.json({
            success: true,
            count: users.length,
            data: { users }
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