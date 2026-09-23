const bcrypt = require('bcryptjs');

// In-Memory Fail-Safe Data Store for Cloud Sandbox Environments without active MongoDB Atlas URIs
class MemoryStore {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    const hashedPasswordUser = await bcrypt.hash('Test@1234', 10);
    const hashedPasswordAdmin = await bcrypt.hash('Admin@1234', 10);

    const user1 = {
      _id: '650000000000000000000001',
      name: 'Standard Test User',
      email: 'testuser@example.com',
      password: hashedPasswordUser,
      role: 'User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    const admin1 = {
      _id: '650000000000000000000002',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    this.users = [user1, admin1];

    this.tasks = [
      {
        _id: '650000000000000000000101',
        title: 'Design Team Onboarding Wireframes',
        description: 'Create interactive wireframes and mockups for the new team onboarding dashboard view.',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        assignedTo: user1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000102',
        title: 'Implement JWT Auth & Bearer Token Middleware',
        description: 'Secure all REST endpoints using JSON Web Tokens with bearer verification.',
        priority: 'Urgent',
        status: 'Completed',
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
        assignedTo: admin1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000103',
        title: 'Set up MongoDB Indexing & Query Optimization',
        description: 'Optimize search queries for task title search and filter queries.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        assignedTo: user1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000104',
        title: 'Configure Docker Compose Multi-Container Stack',
        description: 'Create Dockerfiles and docker-compose orchestration file for single-command setup.',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        assignedTo: user1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000105',
        title: 'Frontend Dark Mode Theme Refinement',
        description: 'Refine Tailwind CSS dark mode palette and glassmorphic card borders across all pages.',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        assignedTo: user1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000106',
        title: 'Build Recharts Analytics Visual Dashboard',
        description: 'Integrate responsive donut and bar charts summarizing task priorities and statuses.',
        priority: 'Urgent',
        status: 'Completed',
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        assignedTo: admin1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000107',
        title: 'Kanban Drag-and-Drop Task Status Board',
        description: 'Implement drag and drop state handlers allowing tasks to move smoothly across pipeline columns.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        assignedTo: user1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '650000000000000000000108',
        title: 'Export Postman & Bruno API Collection',
        description: 'Prepare raw JSON Postman collection containing all REST endpoint test queries.',
        priority: 'Low',
        status: 'Completed',
        dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        assignedTo: admin1,
        createdBy: admin1,
        createdAt: new Date().toISOString(),
      },
    ];

    this.initialized = true;
  }

  async findUserByEmail(email) {
    await this.init();
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    await this.init();
    return this.users.find((u) => u._id.toString() === id.toString()) || null;
  }

  async createUser(userData) {
    await this.init();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      _id: new Date().getTime().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getTasks({ status, priority, search, page = 1, limit = 50 }) {
    await this.init();
    let filtered = [...this.tasks];

    if (status && status !== 'All') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority && priority !== 'All') {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const start = (pageNum - 1) * limitNum;
    const pagedTasks = filtered.slice(start, start + limitNum);

    const pending = this.tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = this.tasks.filter((t) => t.status === 'In Progress').length;
    const completed = this.tasks.filter((t) => t.status === 'Completed').length;

    return {
      tasks: pagedTasks,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      metrics: {
        total: this.tasks.length,
        pending,
        inProgress,
        completed,
      },
    };
  }

  async findTaskById(id) {
    await this.init();
    return this.tasks.find((t) => t._id.toString() === id.toString()) || null;
  }

  async createTask(taskData, creatorId) {
    await this.init();
    const assignedUser = await this.findUserById(taskData.assignedTo) || this.users[0];
    const creatorUser = await this.findUserById(creatorId) || this.users[1] || this.users[0];

    const newTask = {
      _id: new Date().getTime().toString(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      dueDate: new Date(taskData.dueDate).toISOString(),
      assignedTo: assignedUser,
      createdBy: creatorUser,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  async updateTask(id, taskData) {
    await this.init();
    const index = this.tasks.findIndex((t) => t._id.toString() === id.toString());
    if (index === -1) return null;

    const current = this.tasks[index];
    if (taskData.title !== undefined) current.title = taskData.title;
    if (taskData.description !== undefined) current.description = taskData.description;
    if (taskData.priority !== undefined) current.priority = taskData.priority;
    if (taskData.dueDate !== undefined) current.dueDate = new Date(taskData.dueDate).toISOString();
    if (taskData.status !== undefined) current.status = taskData.status;
    if (taskData.assignedTo !== undefined) {
      const assignedUser = await this.findUserById(taskData.assignedTo);
      if (assignedUser) current.assignedTo = assignedUser;
    }

    this.tasks[index] = current;
    return current;
  }

  async deleteTask(id) {
    await this.init();
    const index = this.tasks.findIndex((t) => t._id.toString() === id.toString());
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  async getAllUsers() {
    await this.init();
    return this.users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }
}

module.exports = new MemoryStore();
