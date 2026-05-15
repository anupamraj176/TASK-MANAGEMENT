const express = require('express');
const {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { verifyAuth } = require('../middleware/verifyAuth');
const { verifyAdmin } = require('../middleware/verifyAdmin');

const router = express.Router();

// Admin-only: list and create
router.get('/', verifyAuth, verifyAdmin, listUsers);
router.post('/', verifyAuth, verifyAdmin, createUser);

// Admin or self
router.get('/:id', verifyAuth, getUserById);
router.put('/:id', verifyAuth, updateUser);

// Admin-only delete
router.delete('/:id', verifyAuth, verifyAdmin, deleteUser);

module.exports = router;
