const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connect, disconnect } = require('../src/db');
const Admin = require('../src/models/admin');
const School = require('../src/models/school');
const User = require('../src/models/user');

describe('Users API', () => {
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

  it('superadmin can invite user to any school', async () => {
    const hash = await require('bcryptjs').hash('rootpw', 10);
    await Admin.create({ email: 'root2@example.com', passwordHash: hash, role: 'superadmin' });
    const login = await request(app).post('/cms/auth/login').send({ email: 'root2@example.com', password: 'rootpw' });
    const token = login.body.token;

    const school = await School.create({ name: 'Invite School' });

    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'u1@example.com', school: school._id });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email', 'u1@example.com');
    expect(res.body).toHaveProperty('school');
  });

  it('school admin cannot invite to another school', async () => {
    const shash = await require('bcryptjs').hash('spw', 10);
    await Admin.create({ email: 'sadmin@example.com', passwordHash: shash, role: 'superadmin' });
    const sLogin = await request(app).post('/cms/auth/login').send({ email: 'sadmin@example.com', password: 'spw' });
    const sToken = sLogin.body.token;

    const schoolA = await School.create({ name: 'A' });
    const createRes = await request(app)
      .post('/cms/admins')
      .set('Authorization', `Bearer ${sToken}`)
      .send({ email: 'schoolz@example.com', password: 'pw', role: 'school', school: schoolA._id });
    expect(createRes.statusCode).toBe(201);

    // login as school admin
    const loginSchoolAdmin = await request(app).post('/cms/auth/login').send({ email: 'schoolz@example.com', password: 'pw' });
    const token = loginSchoolAdmin.body.token;

    const schoolB = await School.create({ name: 'B' });

    // attempt to invite user for school B; should be forced to admin's school (A)
    const inviteRes = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'u2@example.com', school: schoolB._id });

    expect(inviteRes.statusCode).toBe(201);
    expect(String(inviteRes.body.school)).toBe(String(createRes.body.school));
  });

  it('list scoping works', async () => {
    const hash = await require('bcryptjs').hash('p1', 10);
    const superAdmin = await Admin.create({ email: 'root3@example.com', passwordHash: hash, role: 'superadmin' });
    const school = await School.create({ name: 'Scoped School' });
    const sHash = await require('bcryptjs').hash('p2', 10);
    const schoolAdmin = await Admin.create({ email: 's2@example.com', passwordHash: sHash, role: 'school', school: school._id });

    // create users
    const u1 = await User.create({ email: 'a@x.com', school: school._id });
    const u2 = await User.create({ email: 'b@x.com', school: null });

    // login as super
    const superLogin = await request(app).post('/cms/auth/login').send({ email: 'root3@example.com', password: 'p1' });
    const superToken = superLogin.body.token;
    const allRes = await request(app).get('/users').set('Authorization', `Bearer ${superToken}`);
    expect(allRes.statusCode).toBe(200);
    expect(Array.isArray(allRes.body)).toBe(true);
    expect(allRes.body.length).toBeGreaterThanOrEqual(2);

    // login as school admin
    const schoolLogin = await request(app).post('/cms/auth/login').send({ email: 's2@example.com', password: 'p2' });
    const schoolToken = schoolLogin.body.token;
    const scopedRes = await request(app).get('/users').set('Authorization', `Bearer ${schoolToken}`);
    expect(scopedRes.statusCode).toBe(200);
    expect(Array.isArray(scopedRes.body)).toBe(true);
    expect(scopedRes.body.every(u => String(u.school) === String(school._id))).toBe(true);

    // delete user as superadmin
    const delRes = await request(app).delete(`/users/${u2._id}`).set('Authorization', `Bearer ${superToken}`);
    expect(delRes.statusCode).toBe(204);

    // invite again then delete as school admin (should be forbidden when different school)
    const u3 = await User.create({ email: 'c@x.com', school: null });
    const forbidden = await request(app).delete(`/users/${u3._id}`).set('Authorization', `Bearer ${schoolToken}`);
    expect(forbidden.statusCode).toBe(403);
  });
});