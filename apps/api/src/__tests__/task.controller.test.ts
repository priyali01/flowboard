import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';

jest.mock('../db', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
    }
  },
}));

const mockToken = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET || 'supersecretkey123');

describe('TaskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /v1/projects/:projectId/tasks', () => {
    it('should return tasks for the project if user is owner', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1', ownerId: 'user-123' });
      (prisma.task.findMany as jest.Mock).mockResolvedValue([
        { id: 'task-1', title: 'Buy milk', projectId: 'proj-1' }
      ]);

      const res = await request(app)
        .get('/v1/projects/proj-1/tasks')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 'task-1', title: 'Buy milk', projectId: 'proj-1' }]);
    });
  });

  describe('POST /v1/projects/:projectId/tasks', () => {
    it('should create a new task', async () => {
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ id: 'proj-1', ownerId: 'user-123' });
      (prisma.task.create as jest.Mock).mockResolvedValue({
        id: 'task-2', title: 'New Task', projectId: 'proj-1'
      });

      const res = await request(app)
        .post('/v1/projects/proj-1/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ title: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Task');
    });
  });
});
