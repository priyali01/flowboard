import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

jest.mock('../db', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockToken = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET || 'supersecretkey123');

describe('ProjectController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/projects', () => {
    it('should return projects for the user', async () => {
      (prisma.project.findMany as jest.Mock).mockResolvedValue([
        { id: 'proj-1', name: 'Work', ownerId: 'user-123' }
      ]);

      const res = await request(app)
        .get('/v1/projects')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 'proj-1', name: 'Work', ownerId: 'user-123' }]);
    });
  });

  describe('POST /v1/projects', () => {
    it('should create a new project', async () => {
      (prisma.project.create as jest.Mock).mockResolvedValue({
        id: 'proj-2', name: 'Personal', ownerId: 'user-123'
      });

      const res = await request(app)
        .post('/v1/projects')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ name: 'Personal' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Personal');
    });
  });
});
