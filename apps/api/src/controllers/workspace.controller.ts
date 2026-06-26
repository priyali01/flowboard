import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
});

export class WorkspaceController {
  async getWorkspaces(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      const workspaces = await prisma.workspace.findMany({
        where: {
          members: {
            some: { userId }
          }
        },
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
      
      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
  }

  async createWorkspace(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { name } = createWorkspaceSchema.parse(req.body);

      const workspace = await prisma.workspace.create({
        data: {
          name,
          ownerId: userId,
          members: {
            create: {
              userId,
              role: 'OWNER'
            }
          }
        },
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } }
          }
        }
      });

      res.status(201).json(workspace);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to create workspace' });
    }
  }
}

export const workspaceController = new WorkspaceController();
