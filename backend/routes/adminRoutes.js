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
/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard stats
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *       403:
 *         description: Admin only
 */
router.get('/stats', getDashboardStats);

// User Statistics
/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     tags: [Admin]
 *     summary: Get user statistics
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 *       403:
 *         description: Admin only
 */
router.get('/statistics', getUserStatistics);

// Users Management
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List users
 */
router.get('/users', getAllUsers);
/**
 * @swagger
 * /api/admin/users/search:
 *   get:
 *     tags: [Admin]
 *     summary: Search users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/users/search', searchUsers);
/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user details
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/users/:id', getUserDetails);
/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     summary: Update user role
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Updated role
 */
router.put('/users/:id/role', updateUserRole);
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:id', deleteUser);

// Admins Management
/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     tags: [Admin]
 *     summary: Get all admins
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List admins
 */
router.get('/admins', getAllAdmins);

module.exports = router;
