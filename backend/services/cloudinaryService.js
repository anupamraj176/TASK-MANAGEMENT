const cloudinary = require('../config/cloudinary');
const path = require('path');

const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: `TASK_MANAGEMENT/${Date.now()}-${path.parse(fileName).name}`,
        overwrite: true,
        type: 'upload',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
