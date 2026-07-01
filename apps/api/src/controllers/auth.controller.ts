import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { prisma } from '../db';
import { z } from 'zod';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const passwordHash = await authService.hashPassword(data.password);
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: data.name,
          projects: {
            create: {
              name: 'Inbox',
              color: 'gray',
            }
          }
        },
      });

      res.status(201).json({ id: user.id, email: user.email, name: user.name });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors });
      }
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { email: data.email } });
      
      if (!user || !(await authService.comparePassword(data.password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const tokens = authService.generateTokens({ userId: user.id });
      
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({ accessToken: tokens.accessToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
      }

      const decoded = authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      // Ensure token exists and is valid in database
      const dbToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!dbToken || dbToken.expiresAt < new Date()) {
        return res.status(401).json({ error: 'Refresh token revoked or expired' });
      }

      const tokens = authService.generateTokens({ userId: dbToken.user.id });

      // Rotate the refresh token for security (optional but recommended)
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      
      await prisma.refreshToken.create({
        data: {
          userId: dbToken.user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const authController = new AuthController();
