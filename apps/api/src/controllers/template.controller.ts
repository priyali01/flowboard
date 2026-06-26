import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { verifyProjectAccess } from '../utils/permissions';

const createTemplateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  labelIds: z.array(z.string().uuid()).optional(),
  workspaceId: z.string().uuid(),
});

export class TemplateController {
  async getTemplates(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = String(req.params.workspaceId);

      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } }
      });
      if (!member) return res.status(403).json({ error: 'Not authorized' });

      const templates = await prisma.taskTemplate.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' }
      });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  }

  async createTemplate(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const data = createTemplateSchema.parse(req.body);

      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: data.workspaceId, userId } }
      });
      if (!member || member.role === 'VIEWER') return res.status(403).json({ error: 'Not authorized' });

      const template = await prisma.taskTemplate.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority || 'MEDIUM',
          labelIds: data.labelIds || [],
          workspaceId: data.workspaceId,
        }
      });
      res.status(201).json(template);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to create template' });
    }
  }

  async deleteTemplate(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const template = await prisma.taskTemplate.findUnique({ where: { id } });
      if (!template) return res.status(404).json({ error: 'Template not found' });

      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: template.workspaceId, userId } }
      });
      if (!member || member.role === 'VIEWER') return res.status(403).json({ error: 'Not authorized' });

      await prisma.taskTemplate.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete template' });
    }
  }

  async instantiateTemplate(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);
      const { projectId, assigneeId, dueDate } = req.body;

      if (!projectId) return res.status(400).json({ error: 'projectId is required' });

      const template = await prisma.taskTemplate.findUnique({ where: { id } });
      if (!template) return res.status(404).json({ error: 'Template not found' });

      const hasProjectAccess = await verifyProjectAccess(projectId, userId, true);
      if (!hasProjectAccess) return res.status(403).json({ error: 'Not authorized for project' });

      const task = await prisma.task.create({
        data: {
          title: template.title,
          description: template.description,
          priority: template.priority,
          projectId,
          assigneeId,
          dueDate: dueDate ? new Date(dueDate) : null,
          templateId: template.id,
          ...(template.labelIds.length > 0 ? { labels: { connect: template.labelIds.map(lId => ({ id: lId })) } } : {}),
          activities: {
            create: { userId, action: 'CREATED' }
          }
        },
        include: { labels: true, assignee: { select: { id: true, name: true, avatarUrl: true } } }
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to instantiate template' });
    }
  }
}

export const templateController = new TemplateController();
