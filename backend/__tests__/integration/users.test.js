jest.mock('../../mailer/mail', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(),
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  sendResetSuccessEmail: jest.fn().mockResolvedValue(),
}));

const request = require('supertest');
const app = require('../../app');
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require('../helpers/testDb');

const signupUser = async (payload) =>
  request(app).post('/api/auth/signup').send(payload);

const loginUser = async (email, password) =>
  request(app).post('/api/auth/login').send({ email, password });

describe('User CRUD Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it('admin can list users with pagination', async () => {
    await signupUser({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    await signupUser({
      name: 'User One',
      email: 'user1@example.com',
      password: 'User@123',
      role: 'user',
    });

    const loginRes = await loginUser('admin@example.com', 'Admin@123');
    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/users?page=1&limit=10')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
  });

  it('regular user cannot list users', async () => {
    await signupUser({
      name: 'User One',
      email: 'user1@example.com',
      password: 'User@123',
      role: 'user',
    });

    const loginRes = await loginUser('user1@example.com', 'User@123');
    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app).get('/api/users').set('Cookie', cookie);

    expect(res.status).toBe(403);
  });

  it('admin can create and delete a user', async () => {
    await signupUser({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const loginRes = await loginUser('admin@example.com', 'Admin@123');
    const cookie = loginRes.headers['set-cookie'];

    const createRes = await request(app)
      .post('/api/users')
      .set('Cookie', cookie)
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'User@123',
        role: 'user',
      });

    expect(createRes.status).toBe(201);
    const userId = createRes.body.user._id;

    const deleteRes = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Cookie', cookie);

    expect(deleteRes.status).toBe(200);
  });
});
