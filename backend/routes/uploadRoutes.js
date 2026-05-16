const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadDocument } = require('../controllers/uploadController');

// Upload document endpoint
/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags: [Upload]
 *     summary: Upload a PDF document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *       400:
 *         description: Validation error
 */
router.post('/upload', upload.single('document'), uploadDocument);

module.exports = router;
