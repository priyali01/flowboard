import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const createCommentSchema = z.object({
  content: z.string().min(1),
});

export class CommentController {
  async getComments(req: Request, res: Response) {
    try {
      const taskId = String(req.params.taskId);
      const comments = await prisma.comment.findMany({
        where: { taskId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  async createComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const taskId = String(req.params.taskId);
      const { content } = createCommentSchema.parse(req.body);

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true }
      });

      if (!task || task.project.ownerId !== userId) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          taskId,
          userId,
        },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } }
      });

      res.status(201).json(comment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = String(req.params.id);

      const comment = await prisma.comment.findUnique({ where: { id } });
      if (!comment || comment.userId !== userId) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      await prisma.comment.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  }
}

export const commentController = new CommentController();
