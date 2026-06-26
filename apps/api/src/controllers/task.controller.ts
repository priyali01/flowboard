import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { socketService } from '../services/socket.service';

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  labelIds: z.array(z.string().uuid()).optional(),
  position: z.number().int().optional(),
});

const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int()
  }))
});

const buildTaskFilter = (req: Request) => {
  const { search, status, priority, labelId, dueDateStart, dueDateEnd } = req.query;
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  if (status) where.status = String(status);
  if (priority) where.priority = String(priority);
  if (labelId) {
    where.labels = { some: { id: String(labelId) } };
  }
  if (dueDateStart || dueDateEnd) {
    where.dueDate = {};
    if (dueDateStart) where.dueDate.gte = new Date(String(dueDateStart));
    if (dueDateEnd) where.dueDate.lte = new Date(String(dueDateEnd));
  }
  return where;
};

const buildTaskSort = (req: Request): any => {
  const { sortBy, sortOrder } = req.query;
  if (sortBy) {
    return { [String(sortBy)]: sortOrder === 'desc' ? 'desc' : 'asc' };
  }
  return { position: 'asc' }; // Default by position
};

export class TaskController {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const projectId = String(req.params.projectId);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const where = { ...buildTaskFilter(req), projectId };
      const orderBy = buildTaskSort(req);

      const tasks = await prisma.task.findMany({
        where,
        include: { labels: true, project: true },
        orderBy,
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const projectId = String(req.params.projectId);
      const { labelIds, ...data } = createTaskSchema.parse(req.body);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const task = await prisma.task.create({
        data: {
          ...data,
          projectId,
          ...(labelIds ? { labels: { connect: labelIds.map(id => ({ id })) } } : {}),
          activities: {
            create: { userId, action: 'CREATED' }
          }
        },
        include: { labels: true }
      });

      socketService.emitToUser(userId, 'task_created', task);

      res.status(201).json(task);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);
      const { labelIds, ...data } = createTaskSchema.partial().parse(req.body);

      const task = await prisma.task.findUnique({ where: { id }, include: { project: true } });
      if (!task || task.project.ownerId !== userId) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const activitiesToCreate = [];
      if (data.status && data.status !== task.status) {
        activitiesToCreate.push({ userId, action: 'STATUS_CHANGED', oldValue: task.status, newValue: data.status });
      } else {
        activitiesToCreate.push({ userId, action: 'UPDATED' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...data,
          ...(labelIds ? { labels: { set: labelIds.map(id => ({ id })) } } : {}),
          activities: {
            create: activitiesToCreate
          }
        },
        include: { labels: true }
      });

      if (data.status && data.status !== task.status) {
        await prisma.notification.create({
          data: { userId, message: `Task "${task.title}" status changed to ${data.status}` }
        });
        socketService.emitToUser(userId, 'new_notification', {});
      }

      socketService.emitToUser(userId, 'task_updated', updatedTask);

      res.json(updatedTask);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const task = await prisma.task.findUnique({ where: { id }, include: { project: true } });
      if (!task || task.project.ownerId !== userId) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await prisma.task.delete({ where: { id } });

      socketService.emitToUser(userId, 'task_deleted', { id });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const where = { ...buildTaskFilter(req), project: { ownerId: userId } };
      const orderBy = buildTaskSort(req);

      const tasks = await prisma.task.findMany({
        where,
        include: { labels: true, project: true },
        orderBy,
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch global tasks' });
    }
  }

  async reorderTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const projectId = String(req.params.projectId);
      const data = reorderTasksSchema.parse(req.body);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Update positions in a transaction
      await prisma.$transaction(
        data.tasks.map((task) =>
          prisma.task.update({
            where: { id: task.id },
            data: { position: task.position },
          })
        )
      );

      socketService.emitToUser(userId, 'task_reordered', {});

      res.json({ message: 'Tasks reordered successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to reorder tasks' });
    }
  }
}

export const taskController = new TaskController();
