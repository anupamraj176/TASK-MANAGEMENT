const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

const MAX_FILES_PER_TASK = parseInt(process.env.MAX_FILES_PER_TASK) || 3;

const buildAttachments = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploads = files.map(async (file) => {
    const result = await uploadToCloudinary(file.buffer, file.originalname);
    const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
    return {
      fileName: file.originalname,
      url: result.secure_url,
      downloadUrl,
      publicId: result.public_id,
      uploadedAt: new Date(),
    };
  });

  return Promise.all(uploads);
};

const parseDateInput = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const parseDocumentIds = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (_error) {
      // fall through to comma-separated parsing
    }
    return trimmed.split(',').map((id) => id.trim()).filter(Boolean);
  }
  return [];
};

const listTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const status = req.query.status;
    const priority = req.query.priority;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const dueDateFrom = req.query.dueDateFrom;
    const dueDateTo = req.query.dueDateTo;

    const filter = {};
    const isAdmin = req.userRole === 'admin';
    if (!isAdmin) {
      filter.assignedTo = req.userId;
    }

    if (status) {
      if (!['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status filter' });
      }
      filter.status = status;
    }
    if (priority) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority filter' });
      }
      filter.priority = priority;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (dueDateFrom || dueDateTo) {
      const fromDate = parseDateInput(dueDateFrom);
      const toDate = parseDateInput(dueDateTo);
      if (dueDateFrom && !fromDate) {
        return res.status(400).json({ success: false, message: 'Invalid dueDateFrom' });
      }
      if (dueDateTo && !toDate) {
        return res.status(400).json({ success: false, message: 'Invalid dueDateTo' });
      }
      filter.dueDate = {};
      if (fromDate) filter.dueDate.$gte = fromDate;
      if (toDate) filter.dueDate.$lte = toDate;
    }

    const total = await Task.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const skip = (page - 1) * limit;

    let tasks = [];
    if (sortBy === 'priority') {
      tasks = await Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityRank: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'low'] }, then: 1 },
                  { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'high'] }, then: 3 },
                ],
                default: 2,
              },
            },
          },
        },
        { $sort: { priorityRank: sortOrder, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      const sortField = ['dueDate', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt';
      tasks = await Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({
      data: tasks,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('List tasks error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const isAdmin = req.userRole === 'admin';

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (status && !['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    let assignedUserId = req.userId;
    if (isAdmin && assignedTo) {
      if (!mongoose.isValidObjectId(assignedTo)) {
        return res.status(400).json({ success: false, message: 'Invalid assignedTo id' });
      }
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ success: false, message: 'Assigned user not found' });
      }
      assignedUserId = assignedTo;
    }

    const files = req.files || [];
    if (files.length > MAX_FILES_PER_TASK) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_FILES_PER_TASK} documents allowed`,
      });
    }

    const attachments = await buildAttachments(files);

    const parsedDueDate = parseDateInput(dueDate);
    if (dueDate && !parsedDueDate) {
      return res.status(400).json({ success: false, message: 'Invalid dueDate' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: parsedDueDate || undefined,
      assignedTo: assignedUserId,
      createdBy: req.userId,
      attachedDocuments: attachments,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isAdmin = req.userRole === 'admin';
    if (!isAdmin && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isAdmin = req.userRole === 'admin';
    if (!isAdmin && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      replaceDocuments,
    } = req.body;

    if (status && !['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    if (dueDate !== undefined) {
      const parsedDate = parseDateInput(dueDate);
      if (dueDate && !parsedDate) {
        return res.status(400).json({ success: false, message: 'Invalid dueDate' });
      }
      task.dueDate = parsedDate || undefined;
    }

    if (isAdmin && assignedTo !== undefined) {
      if (!mongoose.isValidObjectId(assignedTo)) {
        return res.status(400).json({ success: false, message: 'Invalid assignedTo id' });
      }
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ success: false, message: 'Assigned user not found' });
      }
      task.assignedTo = assignedTo;
    }

    const files = req.files || [];
    const shouldReplace = String(replaceDocuments).toLowerCase() === 'true';
    const removeDocumentIds = parseDocumentIds(req.body.removeDocumentIds);

    if (shouldReplace) {
      const docsToDelete = task.attachedDocuments || [];
      for (const doc of docsToDelete) {
        if (doc.publicId) {
          await deleteFromCloudinary(doc.publicId);
        }
      }
      task.attachedDocuments = [];
    } else if (removeDocumentIds.length > 0) {
      for (const docId of removeDocumentIds) {
        if (!mongoose.isValidObjectId(docId)) {
          return res.status(400).json({ success: false, message: 'Invalid document id' });
        }
        const document = task.attachedDocuments.id(docId);
        if (!document) {
          return res.status(404).json({ success: false, message: 'Document not found' });
        }
        if (document.publicId) {
          await deleteFromCloudinary(document.publicId);
        }
        document.remove();
      }
    }

    if (files.length > 0) {
      const newAttachments = await buildAttachments(files);
      const currentCount = task.attachedDocuments.length;
      if (!shouldReplace && currentCount + newAttachments.length > MAX_FILES_PER_TASK) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${MAX_FILES_PER_TASK} documents allowed`,
        });
      }

      if (shouldReplace) {
        task.attachedDocuments = newAttachments;
      } else {
        task.attachedDocuments.push(...newAttachments);
      }
    }

    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isAdmin = req.userRole === 'admin';
    if (!isAdmin && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const docsToDelete = task.attachedDocuments || [];
    for (const doc of docsToDelete) {
      if (doc.publicId) {
        await deleteFromCloudinary(doc.publicId);
      }
    }

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTaskDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isAdmin = req.userRole === 'admin';
    if (!isAdmin && task.assignedTo.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const document = task.attachedDocuments.id(docId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    return res.redirect(document.downloadUrl || document.url);
  } catch (error) {
    console.error('Get task document error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskDocument,
};
