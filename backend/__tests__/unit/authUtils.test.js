const jwt = require('jsonwebtoken');
const { generateTokenAndSetCookie } = require('../../utils/generateToken');
const { verifyAuth } = require('../../middleware/verifyAuth');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Utils Unit Tests', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_jwt_secret';
  });

  it('should generate token and set cookie', () => {
    const res = createRes();
    const token = generateTokenAndSetCookie(res, 'user-id', 'user');

    expect(token).toBeTruthy();
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
      })
    );
  });

  it('should verify token from cookies and call next', () => {
    const token = jwt.sign({ userId: 'user-id', role: 'user' }, process.env.JWT_SECRET);
    const req = { cookies: { token } };
    const res = createRes();
    const next = jest.fn();

    verifyAuth(req, res, next);

    expect(req.userId).toBe('user-id');
    expect(req.userRole).toBe('user');
    expect(next).toHaveBeenCalled();
  });
});
