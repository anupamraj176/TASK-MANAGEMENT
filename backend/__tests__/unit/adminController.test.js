jest.mock('../../models/User', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const User = require('../../models/User');
const {
  getDashboardStats,
  getAllUsers,
  getAllAdmins,
  deleteUser,
  getUserDetails,
  updateUserRole,
  searchUsers,
  getUserStatistics,
} = require('../../controllers/adminController');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Admin Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns dashboard stats', async () => {
    User.countDocuments
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(9);

    const res = createRes();
    await getDashboardStats({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it('returns all users', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: '1' }]),
    });

    const res = createRes();
    await getAllUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns all admins', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: '2' }]),
    });

    const res = createRes();
    await getAllAdmins({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when deleting missing user', async () => {
    User.findById.mockResolvedValue(null);

    const res = createRes();
    await deleteUser({ params: { id: 'x' }, userId: 'admin' }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('prevents deleting another admin', async () => {
    User.findById.mockResolvedValue({
      _id: { toString: () => 'other-admin' },
      role: 'admin',
    });

    const res = createRes();
    await deleteUser({ params: { id: 'x' }, userId: 'admin' }, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('deletes user successfully', async () => {
    User.findById.mockResolvedValue({
      _id: { toString: () => 'user' },
      role: 'user',
    });
    User.findByIdAndDelete.mockResolvedValue(true);

    const res = createRes();
    await deleteUser({ params: { id: 'user' }, userId: 'admin' }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when user details not found', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = createRes();
    await getUserDetails({ params: { id: 'x' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns user details', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '1', name: 'User' }),
    });

    const res = createRes();
    await getUserDetails({ params: { id: '1' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updates user role', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '1', role: 'admin' }),
    });

    const res = createRes();
    await updateUserRole({ params: { id: '1' }, body: { role: 'admin' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when role update user not found', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const res = createRes();
    await updateUserRole({ params: { id: '1' }, body: { role: 'admin' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('rejects invalid role update', async () => {
    const res = createRes();
    await updateUserRole({ params: { id: '1' }, body: { role: 'bad' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('searches users', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: '1' }]),
    });

    const res = createRes();
    await searchUsers({ query: { query: 'john', role: 'user' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns user statistics', async () => {
    User.countDocuments
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(5);

    const res = createRes();
    await getUserStatistics({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
