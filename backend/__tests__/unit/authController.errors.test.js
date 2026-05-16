jest.mock('../../mailer/mail', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(),
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  sendResetSuccessEmail: jest.fn().mockResolvedValue(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(false),
}));

jest.mock('../../utils/generateToken', () => ({
  generateTokenAndSetCookie: jest.fn().mockReturnValue('token'),
}));

jest.mock('../../models/User', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
}));

const User = require('../../models/User');
const {
  signup,
  login,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require('../../controllers/authController');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller Error Paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects signup with missing fields', async () => {
    const res = createRes();
    await signup({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects signup when user exists', async () => {
    User.findOne.mockResolvedValue({ _id: '1' });
    const res = createRes();
    await signup(
      { body: { email: 'a@b.com', password: 'x', name: 'A', role: 'user' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects login when user not found', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const res = createRes();
    await login({ body: { email: 'a@b.com', password: 'x' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects login on role mismatch', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        role: 'user',
        password: 'hashed',
      }),
    });
    const res = createRes();
    await login({ body: { email: 'a@b.com', password: 'x', role: 'admin' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects verify email with invalid code', async () => {
    User.findOne.mockResolvedValue(null);
    const res = createRes();
    await verifyEmail({ body: { code: 'bad' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('verifies email successfully', async () => {
    const userDoc = {
      _id: '1',
      name: 'User',
      email: 'a@b.com',
      role: 'user',
      isVerified: false,
      save: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(userDoc);
    const res = createRes();
    await verifyEmail({ body: { code: '123456' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects checkAuth when user not found', async () => {
    User.findById.mockResolvedValue(null);
    const res = createRes();
    await checkAuth({ userId: '1' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('rejects forgotPassword when email missing', async () => {
    const res = createRes();
    await forgotPassword({ body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects forgotPassword when user not found', async () => {
    User.findOne.mockResolvedValue(null);
    const res = createRes();
    await forgotPassword({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('sends forgotPassword email for existing user', async () => {
    const userDoc = {
      email: 'a@b.com',
      save: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(userDoc);
    const res = createRes();
    await forgotPassword({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects resetPassword with invalid token', async () => {
    User.findOne.mockResolvedValue(null);
    const res = createRes();
    await resetPassword({ params: { token: 'bad' }, body: { password: 'x' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('resets password successfully', async () => {
    const userDoc = {
      email: 'a@b.com',
      save: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(userDoc);
    const res = createRes();
    await resetPassword({ params: { token: 'good' }, body: { password: 'newpass' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects updateProfile when user not found', async () => {
    User.findById.mockResolvedValue(null);
    const res = createRes();
    await updateProfile({ userId: '1', body: { name: 'A' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates profile successfully', async () => {
    const userDoc = {
      _id: '1',
      name: 'Old',
      email: 'a@b.com',
      role: 'user',
      isVerified: true,
      profileImage: '',
      bio: '',
      phoneNumber: '',
      save: jest.fn().mockResolvedValue(true),
    };
    User.findById.mockResolvedValue(userDoc);
    const res = createRes();
    await updateProfile({ userId: '1', body: { name: 'New' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
