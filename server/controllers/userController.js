const User = require('../models/User');

// @desc    Get all users for selection in dropdowns
// @route   GET /users or GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching users' });
  }
};

module.exports = {
  getUsers,
};
