import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().optional(),
  icon: z.string().optional(),
  workspaceId: z.string().uuid().optional(),
});

export class ProjectController {
  async getProjects(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = req.query.workspaceId as string | undefined;

      let whereClause: any = {};
      if (workspaceId) {
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } }
        });
        if (!member) return res.status(403).json({ error: 'Not authorized' });
        whereClause.workspaceId = workspaceId;
      } else {
        whereClause.ownerId = userId;
      }

      const projects = await prisma.project.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const data = createProjectSchema.parse(req.body);
      let { workspaceId, ...rest } = data;

      if (!workspaceId) {
        const personalWorkspace = await prisma.workspace.findFirst({
          where: { ownerId: userId }
        });
        if (personalWorkspace) workspaceId = personalWorkspace.id;
      }

      if (workspaceId) {
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } }
        });
        if (!member || member.role === 'VIEWER') {
          return res.status(403).json({ error: 'Not authorized' });
        }
      }

      const project = await prisma.project.create({
        data: {
          ...rest,
          ownerId: userId,
          workspaceId,
        },
      });

      res.status(201).json(project);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);
      const data = createProjectSchema.partial().parse(req.body);

      const project = await prisma.project.findUnique({ where: { id } });
      if (!project) return res.status(404).json({ error: 'Project not found' });

      if (project.workspaceId) {
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } }
        });
        if (!member || member.role === 'VIEWER') {
          return res.status(403).json({ error: 'Not authorized' });
        }
      } else if (project.ownerId !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          name: data.name,
          color: data.color,
          icon: data.icon
        },
      });

      res.json(updatedProject);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const project = await prisma.project.findUnique({ where: { id } });
      if (!project) return res.status(404).json({ error: 'Project not found' });

      if (project.workspaceId) {
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } }
        });
        if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN' && project.ownerId !== userId)) {
          return res.status(403).json({ error: 'Not authorized' });
        }
      } else if (project.ownerId !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await prisma.project.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}

export const projectController = new ProjectController();
