const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

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
});

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.email).toBe('testuser@example.com');
  });

  it('should not register user with duplicate email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'testuser@example.com',
      password: 'Test@1234',
    });

    const res = await request(app)
      .post('/register')
      .send({
        name: 'Another User',
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should login user with correct credentials', async () => {
    await request(app).post('/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'Test@1234',
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'login@example.com',
        password: 'Test@1234',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'Test@1234',
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'login@example.com',
        password: 'WrongPassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
