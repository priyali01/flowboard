import { Request, Response } from 'express';
import { prisma } from '../db';

export class ActivityController {
  async getActivityFeed(req: Request, res: Response) {
    try {
      const taskId = String(req.params.taskId);
      const userId = (req as any).user.userId;

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true }
      });

      if (!task || task.project.ownerId !== userId) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const activities = await prisma.activity.findMany({
        where: { taskId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      });

      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activity feed' });
    }
  }
}

export const activityController = new ActivityController();
