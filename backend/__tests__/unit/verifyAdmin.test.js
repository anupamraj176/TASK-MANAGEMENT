const { verifyAdmin } = require('../../middleware/verifyAdmin');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyAdmin middleware', () => {
  it('allows admin user', () => {
    const req = { userRole: 'admin' };
    const res = createRes();
    const next = jest.fn();

    verifyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('blocks non-admin user', () => {
    const req = { userRole: 'user' };
    const res = createRes();
    const next = jest.fn();

    verifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
