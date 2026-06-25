import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';

const labelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().max(7),
});

export class LabelController {
  static async getLabels(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = String((req as any).user?.userId);
      const labels = await prisma.label.findMany({
        where: { ownerId },
        orderBy: { createdAt: 'desc' },
      });
      res.json(labels);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch labels' });
    }
  }

  static async createLabel(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = String((req as any).user?.userId);
      const data = labelSchema.parse(req.body);

      const label = await prisma.label.create({
        data: {
          ...data,
          ownerId,
        },
      });

      res.status(201).json(label);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
        return;
      }
      res.status(500).json({ error: 'Failed to create label' });
    }
  }

  static async updateLabel(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const ownerId = String((req as any).user?.userId);
      const data = labelSchema.partial().parse(req.body);

      const label = await prisma.label.findUnique({ where: { id } });
      if (!label || label.ownerId !== ownerId) {
        res.status(404).json({ error: 'Label not found' });
        return;
      }

      const updated = await prisma.label.update({
        where: { id },
        data,
      });

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
        return;
      }
      res.status(500).json({ error: 'Failed to update label' });
    }
  }

  static async deleteLabel(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const ownerId = String((req as any).user?.userId);

      const label = await prisma.label.findUnique({ where: { id } });
      if (!label || label.ownerId !== ownerId) {
        res.status(404).json({ error: 'Label not found' });
        return;
      }

      await prisma.label.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete label' });
    }
  }
}
