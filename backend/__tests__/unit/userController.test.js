jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
}));

jest.mock('../../models/User', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const User = require('../../models/User');
const {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../../controllers/userController');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists users with pagination', async () => {
    User.countDocuments.mockResolvedValue(1);
    const chain = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: '1' }]),
    };
    User.find.mockReturnValue(chain);

    const res = createRes();
    await listUsers({ query: { page: '1', limit: '10' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('lists users with role/search and sorting by name asc', async () => {
    User.countDocuments.mockResolvedValue(2);
    const chain = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: '1' }, { _id: '2' }]),
    };
    User.find.mockReturnValue(chain);

    const res = createRes();
    await listUsers(
      { query: { page: '1', limit: '5', role: 'user', search: 'john', sortBy: 'name', sortOrder: 'asc' } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects create when required fields missing', async () => {
    const res = createRes();
    await createUser({ body: { email: 'a@b.com' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid role', async () => {
    const res = createRes();
    await createUser(
      { body: { name: 'A', email: 'a@b.com', password: 'x', role: 'bad' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects duplicate email', async () => {
    User.findOne.mockResolvedValue({ _id: '1' });
    const res = createRes();
    await createUser(
      { body: { name: 'A', email: 'a@b.com', password: 'x', role: 'user' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates user successfully', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: '1',
      name: 'A',
      email: 'a@b.com',
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
    });
    const res = createRes();
    await createUser(
      { body: { name: 'A', email: 'a@b.com', password: 'x', role: 'user' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('blocks non-admin from viewing other user', async () => {
    const res = createRes();
    await getUserById({ params: { id: '2' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 404 when user not found', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const res = createRes();
    await getUserById({ params: { id: '1' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns user profile for self', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '1', name: 'User' }),
    });
    const res = createRes();
    await getUserById({ params: { id: '1' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updates user profile as admin', async () => {
    User.findOne.mockResolvedValue(null);
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '1', name: 'New' }),
    });
    const res = createRes();
    await updateUser(
      { params: { id: '1' }, userId: '2', userRole: 'admin', body: { name: 'New' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('blocks non-admin from updating another user', async () => {
    const res = createRes();
    await updateUser(
      { params: { id: '2' }, userId: '1', userRole: 'user', body: { name: 'X' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('rejects invalid role update', async () => {
    const res = createRes();
    await updateUser(
      { params: { id: '1' }, userId: '1', userRole: 'admin', body: { role: 'bad' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects empty email', async () => {
    const res = createRes();
    await updateUser(
      { params: { id: '1' }, userId: '1', userRole: 'admin', body: { email: '   ' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects duplicate email on update', async () => {
    User.findOne.mockResolvedValue({ _id: '2', toString: () => '2' });
    const res = createRes();
    await updateUser(
      { params: { id: '1' }, userId: '1', userRole: 'admin', body: { email: 'test@example.com' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updates isVerified when admin', async () => {
    User.findOne.mockResolvedValue(null);
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '1', isVerified: true }),
    });
    const res = createRes();
    await updateUser(
      { params: { id: '1' }, userId: '1', userRole: 'admin', body: { isVerified: true } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deletes user', async () => {
    User.findById.mockResolvedValue({ _id: '1' });
    User.findByIdAndDelete.mockResolvedValue(true);
    const res = createRes();
    await deleteUser({ params: { id: '1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when deleting missing user', async () => {
    User.findById.mockResolvedValue(null);
    const res = createRes();
    await deleteUser({ params: { id: 'missing' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
