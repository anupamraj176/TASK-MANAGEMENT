const jwt = require('jsonwebtoken');
const { verifyAuth } = require('../../middleware/verifyAuth');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyAuth middleware', () => {
  const originalVerify = jwt.verify;

  afterEach(() => {
    jwt.verify = originalVerify;
    jest.clearAllMocks();
  });

  it('returns 401 when no token provided', () => {
    const req = { cookies: {}, headers: {} };
    const res = createRes();
    const next = jest.fn();

    verifyAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('parses token from cookie header', () => {
    const token = jwt.sign({ userId: 'user-id', role: 'user' }, 'secret');
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user-id', role: 'user' });

    const req = { cookies: {}, headers: { cookie: `token=${token}` } };
    const res = createRes();
    const next = jest.fn();

    verifyAuth(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(req.userId).toBe('user-id');
    expect(req.userRole).toBe('user');
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 for invalid token', () => {
    jwt.verify = jest.fn(() => {
      throw new Error('bad token');
    });

    const req = { cookies: { token: 'bad' }, headers: {} };
    const res = createRes();
    const next = jest.fn();

    verifyAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
