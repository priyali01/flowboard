import request from 'supertest';
import { app } from '../app';
import { prisma } from '../db';
import { AuthService } from '../services/auth.service';

// Mock the prisma client and auth service
jest.mock('../db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../services/auth.service');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (AuthService.prototype.hashPassword as jest.Mock).mockResolvedValue('hashed_pw');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'test@test.com',
        name: 'Test User',
      });

      const res = await request(app).post('/v1/auth/register').send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: '123', email: 'test@test.com', name: 'Test User' });
    });

    it('should return 400 if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '123' });

      const res = await request(app).post('/v1/auth/register').send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already exists');
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should login a user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'test@test.com',
        name: 'Test User',
        passwordHash: 'hashed_pw',
      });
      (AuthService.prototype.comparePassword as jest.Mock).mockResolvedValue(true);
      (AuthService.prototype.generateTokens as jest.Mock).mockReturnValue({
        accessToken: 'access_t',
        refreshToken: 'refresh_t',
      });
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

      const res = await request(app).post('/v1/auth/login').send({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBe('access_t');
      expect(res.body.user).toEqual({ id: '123', email: 'test@test.com', name: 'Test User' });
    });
  });
});
