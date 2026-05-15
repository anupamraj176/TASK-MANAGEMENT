const { uploadToCloudinary } = require('../services/cloudinaryService');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Check file count (max 3 files per task)
    const maxFiles = parseInt(process.env.MAX_FILES_PER_TASK) || 3;
    if (req.files && req.files.length >= maxFiles) {
      return res.status(400).json({
        error: `Maximum ${maxFiles} files allowed per task`,
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // Generate accessible URL for PDF download/view
    const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        cloudinaryUrl: result.secure_url,
        downloadUrl: downloadUrl,
        publicId: result.public_id,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'File upload failed',
      message: error.message,
    });
  }
};

module.exports = { uploadDocument };
