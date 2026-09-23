const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Express Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes for both standard /api/... and direct REST routes per PDF specification
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Direct PDF spec endpoint mappings (/register, /login, /tasks, /users)
app.post('/register', require('./controllers/authController').registerUser);
app.post('/login', require('./controllers/authController').loginUser);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Task & Team Management Platform API Server is active',
    documentation: '/api/docs',
    status: 'online',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server after MongoDB connection is fully established
const startServer = async () => {
  if (process.env.NODE_ENV !== 'test') {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection error during startup:', err.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;
