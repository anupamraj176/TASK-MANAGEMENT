const bcrypt = require('bcryptjs');

jest.mock('../../mailer/mail', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(),
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(),
  sendResetSuccessEmail: jest.fn().mockResolvedValue(),
}));

jest.mock('../../utils/generateToken', () => ({
  generateTokenAndSetCookie: jest.fn().mockReturnValue('test-token'),
}));

jest.mock('../../models/User', () => {
  const UserMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  }));
  UserMock.findOne = jest.fn();
  return UserMock;
});

const { signup, login } = require('../../controllers/authController');
const User = require('../../models/User');
const { generateTokenAndSetCookie } = require('../../utils/generateToken');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        role: 'user',
      },
    };
    const res = createRes();

    User.findOne.mockResolvedValue(null);
    User.mockImplementation(() => ({
      _id: 'user-id',
      email: req.body.email.toLowerCase(),
      password: 'hashed',
      name: req.body.name,
      role: req.body.role,
      isVerified: false,
      save: jest.fn().mockResolvedValue(true),
    }));

    await signup(req, res);

    expect(User.findOne).toHaveBeenCalled();
    expect(generateTokenAndSetCookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });

  it('should login an existing user with valid password', async () => {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const userDoc = {
      _id: 'user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      isVerified: true,
      profileImage: '',
      bio: '',
      phoneNumber: '',
      createdAt: new Date(),
      lastLogin: new Date(),
      password: hashedPassword,
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc),
    });

    const req = {
      body: {
        email: 'test@example.com',
        password: 'Password123',
      },
    };
    const res = createRes();

    await login(req, res);

    expect(User.findOne).toHaveBeenCalled();
    expect(generateTokenAndSetCookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
      })
    );
  });
});
