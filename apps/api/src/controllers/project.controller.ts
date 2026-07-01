import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { socketService } from '../services/socket.service';

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

      const projects = await prisma.project.findMany({
        where: { ownerId: userId },
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

      await prisma.notification.create({
        data: {
          userId,
          type: 'PROJECT_CREATED',
          title: 'Project Created',
          message: `Project "${project.name}" was created.`,
          icon: 'FolderPlus',
          entityId: project.id,
          entityType: 'PROJECT'
        }
      });
      socketService.emitToUser(userId, 'new_notification', {});

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

      if (data.name && data.name !== project.name) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'PROJECT_RENAMED',
            title: 'Project Renamed',
            message: `Project "${project.name}" was renamed to "${data.name}".`,
            icon: 'Edit2',
            entityId: project.id,
            entityType: 'PROJECT'
          }
        });
        socketService.emitToUser(userId, 'new_notification', {});
      }

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

      await prisma.notification.create({
        data: {
          userId,
          type: 'PROJECT_DELETED',
          title: 'Project Deleted',
          message: `Project "${project.name}" was deleted.`,
          icon: 'Trash2',
          entityId: null,
          entityType: 'PROJECT'
        }
      });
      socketService.emitToUser(userId, 'new_notification', {});

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}

export const projectController = new ProjectController();
