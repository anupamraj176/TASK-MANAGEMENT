const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllAdmins,
  deleteUser,
  getUserDetails,
  updateUserRole,
  searchUsers,
  getUserStatistics,
} = require('../controllers/adminController');
const { verifyAuth } = require('../middleware/verifyAuth');
const { verifyAdmin } = require('../middleware/verifyAdmin');

const router = express.Router();

// Apply auth & admin middleware to all routes
router.use(verifyAuth, verifyAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// User Statistics
router.get('/statistics', getUserStatistics);

// Users Management
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Admins Management
router.get('/admins', getAllAdmins);

module.exports = router;
