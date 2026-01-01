const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connect, disconnect } = require('../src/db');
const Admin = require('../src/models/admin');
const School = require('../src/models/school');

describe('Admins API', () => {
  let mongoServer;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connect();
  }, 20000);

  beforeEach(async () => {
    // Clear DB between tests
    const db = mongoose.connection.db;
    await db.dropDatabase();
  });

  afterAll(async () => {
    await disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('superadmin can create school admin', async () => {
    const pw = 'superpass123';
    const hash = await bcrypt.hash(pw, 10);
    await Admin.create({ email: 'super@example.com', passwordHash: hash, role: 'superadmin' });

    const login = await request(app).post('/cms/auth/login').send({ email: 'super@example.com', password: pw });
    expect(login.statusCode).toBe(200);
    const token = login.body.token;

    const school = await School.create({ name: 'Test School' });

    const res = await request(app)
      .post('/cms/admins')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'school1@example.com', password: 'schoolpass', role: 'school', school: school._id });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'school1@example.com');
    expect(res.body).toHaveProperty('role', 'school');
    expect(res.body).toHaveProperty('school');
  });

  it('school admin cannot create superadmin', async () => {
    // setup superadmin and create a school-admin
    const spw = 'superpass2';
    const shash = await bcrypt.hash(spw, 10);
    await Admin.create({ email: 'sa@example.com', passwordHash: shash, role: 'superadmin' });
    const sLogin = await request(app).post('/cms/auth/login').send({ email: 'sa@example.com', password: spw });
    const stoken = sLogin.body.token;

    const school = await School.create({ name: 'Another School' });

    const createRes = await request(app)
      .post('/cms/admins')
      .set('Authorization', `Bearer ${stoken}`)
      .send({ email: 'schooladmin@example.com', password: 'pw', role: 'school', school: school._id });
    expect(createRes.statusCode).toBe(201);

    // Login as school admin
    const loginSchoolAdmin = await request(app).post('/cms/auth/login').send({ email: 'schooladmin@example.com', password: 'pw' });
    const token = loginSchoolAdmin.body.token;

    // Attempt to create superadmin
    const res = await request(app)
      .post('/cms/admins')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'bad@example.com', password: 'pw', role: 'superadmin' });

    expect(res.statusCode).toBe(403);
  });

  it('list scoping behaves for superadmin and school admin', async () => {
    const hash = await bcrypt.hash('p1', 10);
    const superAdmin = await Admin.create({ email: 'root@example.com', passwordHash: hash, role: 'superadmin' });
    const school = await School.create({ name: 'Scoped School' });
    const sAdminHash = await bcrypt.hash('p2', 10);
    const schoolAdmin = await Admin.create({ email: 's1@example.com', passwordHash: sAdminHash, role: 'school', school: school._id });

    // login as super
    const superLogin = await request(app).post('/cms/auth/login').send({ email: 'root@example.com', password: 'p1' });
    const superToken = superLogin.body.token;
    const allRes = await request(app).get('/cms/admins').set('Authorization', `Bearer ${superToken}`);
    expect(allRes.statusCode).toBe(200);
    expect(Array.isArray(allRes.body)).toBe(true);
    expect(allRes.body.length).toBeGreaterThanOrEqual(2);

    // login as school admin
    const schoolLogin = await request(app).post('/cms/auth/login').send({ email: 's1@example.com', password: 'p2' });
    const schoolToken = schoolLogin.body.token;
    const scopedRes = await request(app).get('/cms/admins').set('Authorization', `Bearer ${schoolToken}`);
    expect(scopedRes.statusCode).toBe(200);
    expect(Array.isArray(scopedRes.body)).toBe(true);
    // should only include admins for that school
    expect(scopedRes.body.every(a => a.school && a.school === String(school._id))).toBe(true);

    // update school admin's email
    const updateRes = await request(app).put(`/cms/admins/${schoolAdmin._id}`).set('Authorization', `Bearer ${superToken}`).send({ email: 'updated@example.com' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('email', 'updated@example.com');

    // delete the admin
    const delRes = await request(app).delete(`/cms/admins/${schoolAdmin._id}`).set('Authorization', `Bearer ${superToken}`);
    expect(delRes.statusCode).toBe(204);
  });
});
