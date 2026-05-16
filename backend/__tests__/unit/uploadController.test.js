jest.mock('../../services/cloudinaryService', () => ({
  uploadToCloudinary: jest.fn(),
}));

const { uploadToCloudinary } = require('../../services/cloudinaryService');
const { uploadDocument } = require('../../controllers/uploadController');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Upload Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when no file provided', async () => {
    const req = { file: null };
    const res = createRes();

    await uploadDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uploads file successfully', async () => {
    uploadToCloudinary.mockResolvedValue({
      secure_url: 'https://example.com/file.pdf',
      public_id: 'doc-id',
    });

    const req = {
      file: {
        buffer: Buffer.from('pdf'),
        originalname: 'test.pdf',
        size: 123,
        mimetype: 'application/pdf',
      },
    };
    const res = createRes();

    await uploadDocument(req, res);

    expect(uploadToCloudinary).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('handles upload errors', async () => {
    uploadToCloudinary.mockRejectedValue(new Error('upload failed'));

    const req = {
      file: {
        buffer: Buffer.from('pdf'),
        originalname: 'test.pdf',
        size: 123,
        mimetype: 'application/pdf',
      },
    };
    const res = createRes();

    await uploadDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('returns 400 when max files exceeded', async () => {
    const req = {
      file: {
        buffer: Buffer.from('pdf'),
        originalname: 'test.pdf',
        size: 123,
        mimetype: 'application/pdf',
      },
      files: [{}, {}, {}],
    };
    const res = createRes();

    await uploadDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
