import request from 'supertest';
import app from '../src/app';
import * as emailService from '../src/services/emailService';

// Mock email service so no real SMTP connections are made
jest.mock('../src/services/emailService');

const mockEmailService = emailService as jest.Mocked<typeof emailService>;

beforeEach(() => {
  jest.clearAllMocks();
  mockEmailService.sendEnquiryEmail.mockResolvedValue(undefined);
});

const validPayload = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  message: 'I would like more information about this product.',
  productId: 42,
  productTitle: 'Awesome Widget',
};

describe('POST /api/enquiry', () => {
  it('returns 200 with success for a valid payload', async () => {
    const res = await request(app).post('/api/enquiry').send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockEmailService.sendEnquiryEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendEnquiryEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: validPayload.name,
        email: validPayload.email,
        productId: validPayload.productId,
        productTitle: validPayload.productTitle,
      }),
    );
  });

  it('accepts optional phone field', async () => {
    const res = await request(app)
      .post('/api/enquiry')
      .send({ ...validPayload, phone: '+1 555 0100' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 422 when name is missing', async () => {
    const { name, ...payload } = validPayload;
    const res = await request(app).post('/api/enquiry').send(payload);

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    const fields = res.body.errors.map((e: { path: string }) => e.path);
    expect(fields).toContain('name');
  });

  it('returns 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/enquiry')
      .send({ ...validPayload, email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    const fields = res.body.errors.map((e: { path: string }) => e.path);
    expect(fields).toContain('email');
  });

  it('returns 422 when productId is missing', async () => {
    const { productId, ...payload } = validPayload;
    const res = await request(app).post('/api/enquiry').send(payload);

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    const fields = res.body.errors.map((e: { path: string }) => e.path);
    expect(fields).toContain('productId');
  });

  it('returns 422 when message is empty', async () => {
    const res = await request(app)
      .post('/api/enquiry')
      .send({ ...validPayload, message: '' });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('does not call sendEnquiryEmail when validation fails', async () => {
    await request(app).post('/api/enquiry').send({ email: 'bad' });
    expect(mockEmailService.sendEnquiryEmail).not.toHaveBeenCalled();
  });
});
