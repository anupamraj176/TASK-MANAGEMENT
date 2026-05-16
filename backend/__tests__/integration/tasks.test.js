jest.mock('../../mailer/mail', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(),
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  sendResetSuccessEmail: jest.fn().mockResolvedValue(),
}));

const request = require('supertest');
const app = require('../../app');
const Task = require('../../models/Task');
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require('../../test-utils/testDb');

const signupUser = async (payload) =>
  request(app).post('/api/auth/signup').send(payload);

const loginUser = async (email, password) =>
  request(app).post('/api/auth/login').send({ email, password });

describe('Task CRUD Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it('user can create task and only see their own tasks', async () => {
    const adminSignup = await signupUser({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    const userSignup = await signupUser({
      name: 'User One',
      email: 'user1@example.com',
      password: 'User@123',
      role: 'user',
    });

    const userLogin = await loginUser('user1@example.com', 'User@123');
    const userCookie = userLogin.headers['set-cookie'];

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Cookie', userCookie)
      .send({
        title: 'User Task',
        description: 'User task description',
        priority: 'medium',
      });

    expect(createRes.status).toBe(201);

    const userList = await request(app)
      .get('/api/tasks')
      .set('Cookie', userCookie);

    expect(userList.status).toBe(200);
    expect(userList.body.data.length).toBe(1);

    const adminLogin = await loginUser('admin@example.com', 'Admin@123');
    const adminCookie = adminLogin.headers['set-cookie'];

    const adminList = await request(app)
      .get('/api/tasks')
      .set('Cookie', adminCookie);

    expect(adminList.status).toBe(200);
    expect(adminList.body.data.length).toBeGreaterThanOrEqual(1);

    expect(adminSignup.body.user).toBeDefined();
    expect(userSignup.body.user).toBeDefined();
  });

  it('admin can assign tasks and document download redirects', async () => {
    const adminSignup = await signupUser({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    const userSignup = await signupUser({
      name: 'User One',
      email: 'user1@example.com',
      password: 'User@123',
      role: 'user',
    });

    const adminLogin = await loginUser('admin@example.com', 'Admin@123');
    const adminCookie = adminLogin.headers['set-cookie'];

    const assignedTask = await request(app)
      .post('/api/tasks')
      .set('Cookie', adminCookie)
      .send({
        title: 'Assigned Task',
        assignedTo: userSignup.body.user._id,
      });

    expect(assignedTask.status).toBe(201);

    const documentTask = await Task.create({
      title: 'Doc Task',
      assignedTo: userSignup.body.user._id,
      createdBy: adminSignup.body.user._id,
      attachedDocuments: [
        {
          fileName: 'file.pdf',
          url: 'https://example.com/file.pdf',
          downloadUrl: 'https://example.com/file.pdf',
          publicId: 'doc-id',
        },
      ],
    });

    const docId = documentTask.attachedDocuments[0]._id.toString();

    const userLogin = await loginUser('user1@example.com', 'User@123');
    const userCookie = userLogin.headers['set-cookie'];

    const downloadRes = await request(app)
      .get(`/api/tasks/${documentTask._id}/documents/${docId}`)
      .set('Cookie', userCookie);

    expect(downloadRes.status).toBe(302);
    expect(downloadRes.headers.location).toBe('https://example.com/file.pdf');
  });
});
