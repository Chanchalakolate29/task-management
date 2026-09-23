const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('MongoDB Connected successfully');
    } catch (err) {
      console.warn('Could not connect to external MongoDB URI. Starting fallback MongoMemoryServer...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log('Connected to fallback MongoMemoryServer at:', mongoUri);
      } catch (memErr) {
        console.error('Failed to start MongoMemoryServer:', memErr.message);
        throw err;
      }
    }

    await seedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

const seedDatabase = async () => {
  try {
    const User = require('../models/User');
    const Task = require('../models/Task');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial test accounts and tasks...');

      const standardUser = await User.create({
        name: 'Standard Test User',
        email: 'testuser@example.com',
        password: 'Test@1234',
        role: 'User',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });

      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin@1234',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });

      console.log('Seeded users: testuser@example.com & admin@example.com');

      const sampleTasks = [
        {
          title: 'Design Team Onboarding Wireframes',
          description: 'Create interactive wireframes and mockups for the new team onboarding dashboard view.',
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 86400000 * 3),
          assignedTo: standardUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Implement JWT Auth & Bearer Token Middleware',
          description: 'Secure all REST endpoints using JSON Web Tokens with bearer verification.',
          priority: 'Urgent',
          status: 'Completed',
          dueDate: new Date(Date.now() - 86400000 * 1),
          assignedTo: adminUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Set up MongoDB Indexing & Query Optimization',
          description: 'Optimize search queries for task title search and filter queries.',
          priority: 'Medium',
          status: 'Pending',
          dueDate: new Date(Date.now() + 86400000 * 5),
          assignedTo: standardUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Configure Docker Compose Multi-Container Stack',
          description: 'Create Dockerfiles and docker-compose orchestration file for single-command setup.',
          priority: 'Low',
          status: 'Pending',
          dueDate: new Date(Date.now() + 86400000 * 7),
          assignedTo: standardUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Frontend Dark Mode Theme Refinement',
          description: 'Refine Tailwind CSS dark mode palette and glassmorphic card borders across all pages.',
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 86400000 * 2),
          assignedTo: standardUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Build Recharts Analytics Visual Dashboard',
          description: 'Integrate responsive donut and bar charts summarizing task priorities and statuses.',
          priority: 'Urgent',
          status: 'Completed',
          dueDate: new Date(Date.now() - 86400000 * 2),
          assignedTo: adminUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Kanban Drag-and-Drop Task Status Board',
          description: 'Implement drag and drop state handlers allowing tasks to move smoothly across pipeline columns.',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 86400000 * 4),
          assignedTo: standardUser._id,
          createdBy: adminUser._id,
        },
        {
          title: 'Export Postman & Bruno API Collection',
          description: 'Prepare raw JSON Postman collection containing all REST endpoint test queries.',
          priority: 'Low',
          status: 'Completed',
          dueDate: new Date(Date.now() - 86400000 * 3),
          assignedTo: adminUser._id,
          createdBy: adminUser._id,
        },
      ];

      await Task.insertMany(sampleTasks);
      console.log('Seeded 8 initial sample tasks!');
    }
  } catch (seedErr) {
    console.error('Database seeding error:', seedErr.message);
  }
};

module.exports = connectDB;
