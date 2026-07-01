import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { socketService } from '../services/socket.service';
import { verifyProjectAccess } from '../utils/permissions';
import { RRule, rrulestr } from 'rrule';

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  labelIds: z.array(z.string().uuid()).optional(),
  position: z.number().optional(),
  assigneeId: z.string().uuid().optional().nullable(),
  recurrenceRule: z.string().optional().nullable(),
});

const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string().uuid(),
    position: z.number()
  }))
});

const buildTaskFilter = (req: Request) => {
  const { search, status, priority, labelId, dueDateStart, dueDateEnd, assigneeId } = req.query;
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  if (status) where.status = String(status);
  if (priority) where.priority = String(priority);
  if (assigneeId) where.assigneeId = String(assigneeId);
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
  return { position: 'asc' };
};

export class TaskController {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const projectId = String(req.params.projectId);

      const hasAccess = await verifyProjectAccess(projectId, userId);
      if (!hasAccess) return res.status(403).json({ error: 'Not authorized' });

      const where = { ...buildTaskFilter(req), projectId };
      const orderBy = buildTaskSort(req);

      const tasks = await prisma.task.findMany({
        where,
        include: { labels: true, project: true, assignee: { select: { id: true, name: true, avatarUrl: true } } },
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
      const { labelIds, assigneeId, ...data } = createTaskSchema.parse(req.body);

      const hasAccess = await verifyProjectAccess(projectId, userId, true);
      if (!hasAccess) return res.status(403).json({ error: 'Not authorized' });

      const task = await prisma.task.create({
        data: {
          ...data,
          projectId,
          assigneeId,
          ...(labelIds ? { labels: { connect: labelIds.map(id => ({ id })) } } : {}),
          activities: {
            create: { userId, action: 'CREATED' }
          }
        },
        include: { labels: true, assignee: { select: { id: true, name: true, avatarUrl: true } } }
      });

      socketService.emitToUser(userId, 'task_created', task);
      
      await prisma.notification.create({
        data: { 
          userId, 
          type: 'TASK_CREATED',
          title: 'Task Created',
          message: `"${task.title}" was added.`,
          icon: 'CheckSquare',
          entityId: task.id,
          entityType: 'TASK'
        }
      });
      socketService.emitToUser(userId, 'new_notification', {});

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
      const { labelIds, assigneeId, ...data } = createTaskSchema.partial().parse(req.body);

      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });

      const hasAccess = await verifyProjectAccess(task.projectId, userId, true);
      if (!hasAccess) return res.status(403).json({ error: 'Not authorized' });

      const activitiesToCreate = [];
      if (data.status && data.status !== task.status) {
        activitiesToCreate.push({ userId, action: 'STATUS_CHANGED', oldValue: task.status, newValue: data.status });
      } else if (assigneeId !== undefined && assigneeId !== task.assigneeId) {
        activitiesToCreate.push({ userId, action: 'ASSIGNED', newValue: assigneeId || 'unassigned' });
      } else {
        activitiesToCreate.push({ userId, action: 'UPDATED' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...data,
          assigneeId: assigneeId === null ? null : (assigneeId || undefined),
          ...(labelIds ? { labels: { set: labelIds.map(id => ({ id })) } } : {}),
          activities: {
            create: activitiesToCreate
          }
        },
        include: { labels: true, assignee: { select: { id: true, name: true, avatarUrl: true } } }
      });

      // Rich personal notifications
      if (data.status && data.status !== task.status) {
        let title = 'Task Updated';
        let message = `"${task.title}" status changed to ${data.status.toLowerCase().replace('_', ' ')}.`;
        let icon = 'Activity';
        let type = 'TASK_UPDATED';

        if (data.status === 'DONE') {
           title = 'Task Completed';
           message = `You completed "${task.title}". Great job!`;
           icon = 'CheckCircle2';
           type = 'TASK_COMPLETED';
        }

        await prisma.notification.create({
          data: { userId, type, title, message, icon, entityId: task.id, entityType: 'TASK' }
        });
        socketService.emitToUser(userId, 'new_notification', {});

        // Handle Recurrence Spawn
        if (data.status === 'DONE' && updatedTask.recurrenceRule) {
          try {
            const rule = rrulestr(updatedTask.recurrenceRule);
            // Get the next occurrence strictly after the current due date (or now if none)
            const nextDate = rule.after(updatedTask.dueDate || new Date(), false);
            if (nextDate) {
              const newTask = await prisma.task.create({
                data: {
                  title: updatedTask.title,
                  description: updatedTask.description,
                  priority: updatedTask.priority,
                  projectId: updatedTask.projectId,
                  assigneeId: updatedTask.assigneeId,
                  dueDate: nextDate,
                  recurrenceRule: updatedTask.recurrenceRule,
                  labels: {
                    connect: updatedTask.labels.map(l => ({ id: l.id }))
                  },
                  activities: {
                    create: { userId, action: 'CREATED' }
                  }
                },
                include: { labels: true, assignee: { select: { id: true, name: true, avatarUrl: true } } }
              });
              socketService.emitToUser(userId, 'task_created', newTask);
            }
          } catch (err) {
            console.error('Failed to spawn recurring task:', err);
          }
        }
      }

      if (data.priority && data.priority !== task.priority) {
        await prisma.notification.create({
          data: { userId, type: 'TASK_PRIORITY_CHANGED', title: 'Priority Changed', message: `"${task.title}" is now ${data.priority} priority.`, icon: 'Flag', entityId: task.id, entityType: 'TASK' }
        });
        socketService.emitToUser(userId, 'new_notification', {});
      }

      if (data.dueDate !== undefined && data.dueDate !== task.dueDate?.toISOString() && data.dueDate !== null) {
        await prisma.notification.create({
          data: { userId, type: 'TASK_DUE_DATE_CHANGED', title: 'Due Date Updated', message: `"${task.title}" is now due on ${new Date(data.dueDate).toLocaleDateString()}.`, icon: 'Calendar', entityId: task.id, entityType: 'TASK' }
        });
        socketService.emitToUser(userId, 'new_notification', {});
      }

      socketService.emitToUser(userId, 'task_updated', updatedTask);
      if (updatedTask.assigneeId && updatedTask.assigneeId !== userId) {
        socketService.emitToUser(updatedTask.assigneeId, 'task_updated', updatedTask);
      }

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

      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return res.status(404).json({ error: 'Task not found' });

      const hasAccess = await verifyProjectAccess(task.projectId, userId, true);
      if (!hasAccess) return res.status(403).json({ error: 'Not authorized' });

      await prisma.task.delete({ where: { id } });

      await prisma.notification.create({
        data: { 
          userId, 
          type: 'TASK_DELETED',
          title: 'Task Deleted',
          message: `"${task.title}" was deleted.`,
          icon: 'Trash2',
          entityId: null, // Since the task is deleted, no valid entity ID
          entityType: 'TASK'
        }
      });
      socketService.emitToUser(userId, 'new_notification', {});

      socketService.emitToUser(userId, 'task_deleted', { id });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      const projects = await prisma.project.findMany({
        where: { ownerId: userId },
        select: { id: true }
      });
      const projectIds = projects.map(p => p.id);

      const where = { ...buildTaskFilter(req), projectId: { in: projectIds } };
      const orderBy = buildTaskSort(req);

      const tasks = await prisma.task.findMany({
        where,
        include: { labels: true, project: true, assignee: { select: { id: true, name: true, avatarUrl: true } } },
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
      const { tasks } = reorderTasksSchema.parse(req.body);

      const hasAccess = await verifyProjectAccess(projectId, userId, true);
      if (!hasAccess) return res.status(403).json({ error: 'Not authorized' });

      await prisma.$transaction(
        tasks.map((t) => 
          prisma.task.update({
            where: { id: t.id },
            data: { position: t.position }
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
