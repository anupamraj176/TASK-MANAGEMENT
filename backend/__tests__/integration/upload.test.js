jest.mock('../../services/cloudinaryService', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    secure_url: 'https://example.com/file.pdf',
    public_id: 'doc-id',
  }),
}));

const request = require('supertest');
const app = require('../../app');

describe('Upload API', () => {
  it('uploads a PDF successfully', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('document', Buffer.from('pdf'), {
        filename: 'file.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('file');
  });

  it('rejects non-PDF uploads', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('document', Buffer.from('text'), {
        filename: 'file.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(500);
  });
});
