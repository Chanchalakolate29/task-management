const Task = require('../models/Task');

// @desc    Retrieve all tasks with filters, search, sort, and pagination
// @route   GET /tasks or GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, order, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions.createdAt = -1; // Default newest first
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

    // Calculate metrics count for dashboard metrics
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

// @desc    Retrieve a single task by ID
// @route   GET /tasks/:id or GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
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

// @desc    Create a new task
// @route   POST /tasks or POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
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

// @desc    Update an existing task
// @route   PUT /tasks/:id or PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Update fields if provided
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

// @desc    Delete a task
// @route   DELETE /tasks/:id or DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
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
