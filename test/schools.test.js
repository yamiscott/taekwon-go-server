const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connect, disconnect } = require('../src/db');
const Admin = require('../src/models/admin');
const School = require('../src/models/school');

describe('Schools API', () => {
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

  it('superadmin can create and manage schools', async () => {
    const hash = await require('bcryptjs').hash('rootpw', 10);
    await Admin.create({ email: 'root4@example.com', passwordHash: hash, role: 'superadmin' });
    const login = await request(app).post('/cms/auth/login').send({ email: 'root4@example.com', password: 'rootpw' });
    const token = login.body.token;

    const createRes = await request(app)
      .post('/cms/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New School', address: 'Addr', contact: 'someone' });
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('name', 'New School');

    const id = createRes.body._id;
    const getRes = await request(app).get(`/cms/schools/${id}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('name', 'New School');

    const updateRes = await request(app).put(`/cms/schools/${id}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('name', 'Updated');

    const delRes = await request(app).delete(`/cms/schools/${id}`).set('Authorization', `Bearer ${token}`);
    expect(delRes.statusCode).toBe(204);
  });

  it('school admin cannot create schools', async () => {
    const shash = await require('bcryptjs').hash('spw', 10);
    await Admin.create({ email: 'sa2@example.com', passwordHash: shash, role: 'superadmin' });
    const sLogin = await request(app).post('/cms/auth/login').send({ email: 'sa2@example.com', password: 'spw' });
    const sToken = sLogin.body.token;

    const school = await School.create({ name: 'A' });
    const createRes = await request(app)
      .post('/cms/admins')
      .set('Authorization', `Bearer ${sToken}`)
      .send({ email: 'schoolx@example.com', password: 'pw', role: 'school', school: school._id });
    expect(createRes.statusCode).toBe(201);

    const loginSchoolAdmin = await request(app).post('/cms/auth/login').send({ email: 'schoolx@example.com', password: 'pw' });
    const token = loginSchoolAdmin.body.token;

    const res = await request(app).post('/cms/schools').set('Authorization', `Bearer ${token}`).send({ name: 'Should Fail' });
    expect(res.statusCode).toBe(403);
  });

  it('list scoping: super sees all, school admin sees their school', async () => {
    const hash = await require('bcryptjs').hash('p1', 10);
    await Admin.create({ email: 'root5@example.com', passwordHash: hash, role: 'superadmin' });
    const schoolA = await School.create({ name: 'A' });
    const schoolB = await School.create({ name: 'B' });

    const superLogin = await request(app).post('/cms/auth/login').send({ email: 'root5@example.com', password: 'p1' });
    const superToken = superLogin.body.token;

    const allRes = await request(app).get('/cms/schools').set('Authorization', `Bearer ${superToken}`);
    expect(allRes.statusCode).toBe(200);
    expect(Array.isArray(allRes.body)).toBe(true);
    expect(allRes.body.length).toBe(2);

    // create school admin for A
    const sHash = await require('bcryptjs').hash('p2', 10);
    await Admin.create({ email: 's3@example.com', passwordHash: sHash, role: 'school', school: schoolA._id });
    const schoolLogin = await request(app).post('/cms/auth/login').send({ email: 's3@example.com', password: 'p2' });
    const schoolToken = schoolLogin.body.token;

    const scopedRes = await request(app).get('/cms/schools').set('Authorization', `Bearer ${schoolToken}`);
    expect(scopedRes.statusCode).toBe(200);
    expect(Array.isArray(scopedRes.body)).toBe(true);
    expect(scopedRes.body.length).toBe(1);
    expect(scopedRes.body[0]).toHaveProperty('name', 'A');
  });
});