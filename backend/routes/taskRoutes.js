const express = require('express');
const {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskDocument,
} = require('../controllers/taskController');
const upload = require('../middleware/upload');
const { verifyAuth } = require('../middleware/verifyAuth');

const router = express.Router();

router.get('/', verifyAuth, listTasks);
router.post('/', verifyAuth, upload.array('documents', 3), createTask);
router.get('/:id', verifyAuth, getTaskById);
router.put('/:id', verifyAuth, upload.array('documents', 3), updateTask);
router.delete('/:id', verifyAuth, deleteTask);
router.get('/:id/documents/:docId', verifyAuth, getTaskDocument);

module.exports = router;
