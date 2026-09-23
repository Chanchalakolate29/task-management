const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const getUsers = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({}).select('-password').sort({ name: 1 });
      return res.json({
        success: true,
        data: users,
      });
    } else {
      const users = await memoryStore.getAllUsers();
      return res.json({
        success: true,
        data: users,
      });
    }
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching users' });
  }
};

module.exports = {
  getUsers,
};
