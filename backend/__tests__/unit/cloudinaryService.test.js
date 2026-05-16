jest.mock('../../config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn(),
    destroy: jest.fn(),
  },
}));

const cloudinary = require('../../config/cloudinary');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../services/cloudinaryService');

describe('Cloudinary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads file via stream', async () => {
    cloudinary.uploader.upload_stream.mockImplementation((_opts, cb) => {
      cb(null, { secure_url: 'https://example.com/file.pdf', public_id: 'doc-id' });
      return { end: jest.fn() };
    });

    const result = await uploadToCloudinary(Buffer.from('pdf'), 'file.pdf');

    expect(result.secure_url).toContain('example.com');
  });

  it('deletes file by publicId', async () => {
    cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
    const res = await deleteFromCloudinary('doc-id');
    expect(res).toEqual({ result: 'ok' });
  });
});
