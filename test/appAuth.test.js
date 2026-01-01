const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connect, disconnect } = require('../src/db');
const User = require('../src/models/user');

describe('App User Auth', () => {
  let mongoServer;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connect();
  }, 20000);

  beforeEach(async () => {
    const db = mongoose.connection.db;
    await db.dropDatabase();
  });

  afterAll(async () => {
    await disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('accepted user can login and get /auth/me', async () => {
    const u = await User.create({ email: 'appuser@example.com', acceptedAt: new Date() });
    const login = await request(app).post('/auth/login').send({ email: 'appuser@example.com' });
    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');

    const token = login.body.token;
    const me = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.statusCode).toBe(200);
    expect(me.body.user).toHaveProperty('email', 'appuser@example.com');
  });

  it('unaccepted user cannot login', async () => {
    await User.create({ email: 'pending@example.com', acceptedAt: null });
    const login = await request(app).post('/auth/login').send({ email: 'pending@example.com' });
    expect(login.statusCode).toBe(403);
  });
});