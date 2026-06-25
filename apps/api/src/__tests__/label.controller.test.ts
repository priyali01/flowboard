import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

jest.mock('../db', () => ({
  prisma: {
    label: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockToken = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET || 'supersecretkey123');

describe('LabelController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/labels', () => {
    it('should return labels for the user', async () => {
      (prisma.label.findMany as jest.Mock).mockResolvedValue([
        { id: 'label-1', name: 'Bug', color: '#ff0000', ownerId: 'user-123' }
      ]);

      const res = await request(app)
        .get('/v1/labels')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 'label-1', name: 'Bug', color: '#ff0000', ownerId: 'user-123' }]);
    });
  });

  describe('POST /v1/labels', () => {
    it('should create a new label', async () => {
      (prisma.label.create as jest.Mock).mockResolvedValue({
        id: 'label-2', name: 'Feature', color: '#00ff00', ownerId: 'user-123'
      });

      const res = await request(app)
        .post('/v1/labels')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ name: 'Feature', color: '#00ff00' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Feature');
    });
  });

  describe('DELETE /v1/labels/:id', () => {
    it('should delete a label if owner matches', async () => {
      (prisma.label.findUnique as jest.Mock).mockResolvedValue({
        id: 'label-1', name: 'Bug', color: '#ff0000', ownerId: 'user-123'
      });
      (prisma.label.delete as jest.Mock).mockResolvedValue({});

      const res = await request(app)
        .delete('/v1/labels/label-1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(204);
    });
  });
});
