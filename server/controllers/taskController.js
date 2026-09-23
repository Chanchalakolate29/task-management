const mongoose = require('mongoose');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const ensureDBConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

const getTasks = async (req, res) => {
  try {
    await ensureDBConnected();

    const { status, priority, search, sortBy, order, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const allTasksCount = await Task.countDocuments();
    const pendingCount = await Task.countDocuments({ status: 'Pending' });
    const inProgressCount = await Task.countDocuments({ status: 'In Progress' });
    const completedCount = await Task.countDocuments({ status: 'Completed' });

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total: totalTasks,
          page: pageNum,
          pages: Math.ceil(totalTasks / limitNum),
          limit: limitNum,
        },
        metrics: {
          total: allTasksCount,
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount,
        },
      },
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    await ensureDBConnected();
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get Task By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid task ID format' });
    }
    res.status(500).json({ success: false, message: error.message || 'Error fetching task' });
  }
};

const createTask = async (req, res) => {
  try {
    await ensureDBConnected();
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    if (!title || !dueDate || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, dueDate, assignedTo)',
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      assignedTo,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Error creating task' });
  }
};

const updateTask = async (req, res) => {
  try {
    await ensureDBConnected();
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role');

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await ensureDBConnected();
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting task' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
