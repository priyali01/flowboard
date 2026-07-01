import { Request, Response } from 'express';
import { prisma } from '../db';

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification || notification.userId !== userId) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      const updated = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification || notification.userId !== userId) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      await prisma.notification.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  }

  async deleteAllNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      await prisma.notification.deleteMany({
        where: { userId }
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear notifications' });
    }
  }
}

export const notificationController = new NotificationController();
