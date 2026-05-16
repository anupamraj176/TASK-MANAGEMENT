/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Admin
 *     description: Admin endpoints
 *   - name: Tasks
 *     description: Task management endpoints
 *   - name: Upload
 *     description: File upload endpoints
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         isVerified:
 *           type: boolean
 *         profileImage:
 *           type: string
 *         bio:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         lastLogin:
 *           type: string
 *           format: date-time
 *     Attachment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fileName:
 *           type: string
 *         url:
 *           type: string
 *         downloadUrl:
 *           type: string
 *         publicId:
 *           type: string
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         assignedTo:
 *           type: string
 *         createdBy:
 *           type: string
 *         attachedDocuments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 * /health:
 *   get:
 *     tags: [Auth]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 */
const express = require('express');
const {
  signup,
  login,
  logout,
  verifyEmail,
  checkAuth,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require('../controllers/authController');
const { verifyAuth } = require('../middleware/verifyAuth');

const router = express.Router();

// Public routes
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post('/signup', signup);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Logged in
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', logout);
/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email with code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid or expired code
 */
router.post('/verify-email', verifyEmail);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 *       400:
 *         description: Email not found
 */
router.post('/forgot-password', forgotPassword);
/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password/:token', resetPassword);

// Protected routes
/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     tags: [Auth]
 *     summary: Check authenticated user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get('/check-auth', verifyAuth, checkAuth);
/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     tags: [Auth]
 *     summary: Update authenticated user profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               bio:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', verifyAuth, updateProfile);

module.exports = router;
