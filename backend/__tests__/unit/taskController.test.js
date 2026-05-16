jest.mock('../../models/Task', () => ({
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../../models/User', () => ({
  findById: jest.fn(),
}));

jest.mock('../../services/cloudinaryService', () => ({
  uploadToCloudinary: jest.fn(),
  deleteFromCloudinary: jest.fn(),
}));

const mongoose = require('mongoose');
const Task = require('../../models/Task');
const User = require('../../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinaryService');
const {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskDocument,
} = require('../../controllers/taskController');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects invalid status filter', async () => {
    const res = createRes();
    await listTasks({ query: { status: 'bad' }, userRole: 'admin' }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid priority filter', async () => {
    const res = createRes();
    await listTasks({ query: { priority: 'bad' }, userRole: 'admin' }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid dueDate filters', async () => {
    const res = createRes();
    await listTasks({ query: { dueDateFrom: 'bad' }, userRole: 'admin' }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('lists tasks with pagination', async () => {
    Task.countDocuments.mockResolvedValue(1);
    const chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: '1' }]),
    };
    Task.find.mockReturnValue(chain);

    const res = createRes();
    await listTasks({ query: {}, userRole: 'admin' }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('lists tasks with valid filters', async () => {
    Task.countDocuments.mockResolvedValue(1);
    const chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: '1' }]),
    };
    Task.find.mockReturnValue(chain);

    const res = createRes();
    await listTasks(
      {
        query: {
          status: 'todo',
          priority: 'low',
          dueDateFrom: new Date().toISOString(),
          dueDateTo: new Date().toISOString(),
        },
        userRole: 'admin',
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('lists tasks sorted by priority', async () => {
    Task.countDocuments.mockResolvedValue(1);
    Task.aggregate.mockResolvedValue([{ _id: '1' }]);

    const res = createRes();
    await listTasks({ query: { sortBy: 'priority' }, userRole: 'admin' }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects create when title missing', async () => {
    const res = createRes();
    await createTask({ body: {}, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid status on create', async () => {
    const res = createRes();
    await createTask(
      { body: { title: 'Task', status: 'bad' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid priority on create', async () => {
    const res = createRes();
    await createTask(
      { body: { title: 'Task', priority: 'bad' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid dueDate', async () => {
    const res = createRes();
    await createTask(
      { body: { title: 'Task', dueDate: 'bad-date' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid assignedTo id', async () => {
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);
    const res = createRes();
    await createTask(
      { body: { title: 'Task', assignedTo: 'bad' }, userId: '1', userRole: 'admin' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects when assigned user not found', async () => {
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
    User.findById.mockResolvedValue(null);
    const res = createRes();
    await createTask(
      { body: { title: 'Task', assignedTo: '507f1f77bcf86cd799439011' }, userId: '1', userRole: 'admin' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('creates task with admin assignment', async () => {
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
    User.findById.mockResolvedValue({ _id: 'u1' });
    Task.create.mockResolvedValue({ _id: 't1' });
    const res = createRes();

    await createTask(
      {
        body: { title: 'Task', assignedTo: '507f1f77bcf86cd799439011' },
        userId: 'admin',
        userRole: 'admin',
        files: [],
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('rejects when too many files attached', async () => {
    const res = createRes();
    await createTask(
      {
        body: { title: 'Task' },
        userId: '1',
        userRole: 'user',
        files: [{}, {}, {}, {}],
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates task successfully', async () => {
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
    User.findById.mockResolvedValue({ _id: 'u1' });
    Task.create.mockResolvedValue({ _id: 't1' });
    const res = createRes();

    await createTask(
      { body: { title: 'Task' }, userId: '1', userRole: 'user', files: [] },
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 404 when task not found', async () => {
    Task.findById.mockResolvedValue(null);
    const res = createRes();
    await getTaskById({ params: { id: 'x' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('denies access to other user task', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => 'other' },
    });
    const res = createRes();
    await getTaskById({ params: { id: 't1' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('updates task and replaces documents', async () => {
    const taskDoc = {
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [{ publicId: 'doc1' }],
      save: jest.fn().mockResolvedValue(true),
    };

    Task.findById.mockResolvedValue(taskDoc);
    uploadToCloudinary.mockResolvedValue({
      secure_url: 'https://example.com/doc.pdf',
      public_id: 'doc2',
    });

    const res = createRes();
    await updateTask(
      {
        params: { id: 't1' },
        userId: '1',
        userRole: 'user',
        body: { replaceDocuments: 'true' },
        files: [
          { buffer: Buffer.from('pdf'), originalname: 'file.pdf' },
        ],
      },
      res
    );

    expect(deleteFromCloudinary).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('adds documents without replace', async () => {
    const taskDoc = {
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [],
      save: jest.fn().mockResolvedValue(true),
    };

    Task.findById.mockResolvedValue(taskDoc);
    uploadToCloudinary.mockResolvedValue({
      secure_url: 'https://example.com/doc.pdf',
      public_id: 'doc2',
    });

    const res = createRes();
    await updateTask(
      {
        params: { id: 't1' },
        userId: '1',
        userRole: 'user',
        body: {},
        files: [{ buffer: Buffer.from('pdf'), originalname: 'file.pdf' }],
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('removes selected documents on update', async () => {
    const attachedDocuments = [
      { _id: 'doc1', publicId: 'doc1', remove: jest.fn() },
      { _id: 'doc2', publicId: 'doc2', remove: jest.fn() },
    ];
    attachedDocuments.id = (id) =>
      attachedDocuments.find((doc) => doc._id === id) || null;

    const taskDoc = {
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments,
      save: jest.fn().mockResolvedValue(true),
    };

    Task.findById.mockResolvedValue(taskDoc);
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

    const res = createRes();
    await updateTask(
      {
        params: { id: 't1' },
        userId: '1',
        userRole: 'user',
        body: { removeDocumentIds: ['doc1'] },
        files: [],
      },
      res
    );

    expect(deleteFromCloudinary).toHaveBeenCalledWith('doc1');
    expect(attachedDocuments[0].remove).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updates assignedTo as admin', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [],
      save: jest.fn().mockResolvedValue(true),
    });
    jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);
    User.findById.mockResolvedValue({ _id: 'u2' });

    const res = createRes();
    await updateTask(
      {
        params: { id: 't1' },
        userId: 'admin',
        userRole: 'admin',
        body: { assignedTo: '507f1f77bcf86cd799439011' },
        files: [],
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects invalid status update', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [],
    });
    const res = createRes();
    await updateTask(
      { params: { id: 't1' }, userId: '1', userRole: 'user', body: { status: 'bad' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid priority update', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [],
    });
    const res = createRes();
    await updateTask(
      { params: { id: 't1' }, userId: '1', userRole: 'user', body: { priority: 'bad' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid dueDate update', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [],
    });
    const res = createRes();
    await updateTask(
      { params: { id: 't1' }, userId: '1', userRole: 'user', body: { dueDate: 'bad' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('deletes task and attached documents', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: [{ publicId: 'doc1' }],
    });
    Task.findByIdAndDelete.mockResolvedValue(true);

    const res = createRes();
    await deleteTask({ params: { id: 't1' }, userId: '1', userRole: 'user' }, res);
    expect(deleteFromCloudinary).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('denies deleting task from another user', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => 'other' },
    });
    const res = createRes();
    await deleteTask({ params: { id: 't1' }, userId: '1', userRole: 'user' }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('redirects to document download url', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: {
        id: () => ({ downloadUrl: 'https://example.com/doc.pdf' }),
      },
    });
    const res = createRes();
    await getTaskDocument(
      { params: { id: 't1', docId: 'd1' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.redirect).toHaveBeenCalledWith('https://example.com/doc.pdf');
  });

  it('redirects to document url when downloadUrl missing', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: {
        id: () => ({ url: 'https://example.com/doc.pdf' }),
      },
    });
    const res = createRes();
    await getTaskDocument(
      { params: { id: 't1', docId: 'd1' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.redirect).toHaveBeenCalledWith('https://example.com/doc.pdf');
  });

  it('returns 404 when task missing for document', async () => {
    Task.findById.mockResolvedValue(null);
    const res = createRes();
    await getTaskDocument(
      { params: { id: 'missing', docId: 'd1' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('denies document access for another user', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => 'other' },
      attachedDocuments: {
        id: () => ({ downloadUrl: 'https://example.com/doc.pdf' }),
      },
    });
    const res = createRes();
    await getTaskDocument(
      { params: { id: 't1', docId: 'd1' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 404 when document not found', async () => {
    Task.findById.mockResolvedValue({
      _id: 't1',
      assignedTo: { toString: () => '1' },
      attachedDocuments: {
        id: () => null,
      },
    });
    const res = createRes();
    await getTaskDocument(
      { params: { id: 't1', docId: 'missing' }, userId: '1', userRole: 'user' },
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
