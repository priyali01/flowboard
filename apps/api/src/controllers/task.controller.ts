import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export class TaskController {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const projectId = String(req.params.projectId);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
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
      const data = createTaskSchema.parse(req.body);

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const task = await prisma.task.create({
        data: {
          ...data,
          projectId,
        },
      });

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
      const data = createTaskSchema.partial().parse(req.body);

      const task = await prisma.task.findUnique({ where: { id }, include: { project: true } });
      if (!task || task.project.ownerId !== userId) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data,
      });

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
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
}

export const taskController = new TaskController();
