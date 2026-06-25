import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export class ProjectController {
  async getProjects(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
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

      const project = await prisma.project.create({
        data: {
          ...data,
          ownerId: userId,
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
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data,
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
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await prisma.project.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}

export const projectController = new ProjectController();
