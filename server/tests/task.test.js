const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;
let userToken;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});

  const authRes = await request(app).post('/register').send({
    name: 'Task Tester',
    email: 'tester@example.com',
    password: 'Test@1234',
  });

  userToken = authRes.body.data.token;
  userId = authRes.body.data._id;
});

describe('Task Endpoints', () => {
  it('should create a new task when authenticated', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'New Integration Test Task',
        description: 'Testing task creation endpoint',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(),
        assignedTo: userId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New Integration Test Task');
  });

  it('should reject task creation without auth token', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Unauthorized Task',
        dueDate: new Date(),
        assignedTo: userId,
      });

    expect(res.statusCode).toEqual(401);
  });

  it('should retrieve all tasks', async () => {
    await Task.create({
      title: 'Task One',
      dueDate: new Date(),
      assignedTo: userId,
    });

    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tasks.length).toBe(1);
  });

  it('should delete a task by ID', async () => {
    const task = await Task.create({
      title: 'Task To Delete',
      dueDate: new Date(),
      assignedTo: userId,
    });

    const res = await request(app)
      .delete(`/tasks/${task._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
