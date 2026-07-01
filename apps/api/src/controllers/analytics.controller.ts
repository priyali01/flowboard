import { Request, Response } from 'express';
import { prisma } from '../db';

export class AnalyticsController {
  async getDashboardMetrics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      // Get all projects owned by this user
      const projects = await prisma.project.findMany({
        where: { ownerId: userId }
      });
      const projectIds = projects.map(p => p.id);

      // Total Tasks & Completed Tasks
      const totalTasks = await prisma.task.count({
        where: { projectId: { in: projectIds } }
      });
      const completedTasks = await prisma.task.count({
        where: { projectId: { in: projectIds }, status: 'DONE' }
      });

      // Overdue Tasks
      const overdueTasks = await prisma.task.count({
        where: { 
          projectId: { in: projectIds }, 
          status: { not: 'DONE' },
          dueDate: { lt: new Date() }
        }
      });

      // Completion by day (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const completionActivities = await prisma.activity.findMany({
        where: {
          task: { projectId: { in: projectIds } },
          action: 'STATUS_CHANGED',
          newValue: 'DONE',
          createdAt: { gte: thirtyDaysAgo }
        },
        select: { createdAt: true }
      });

      const completedByDay: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        completedByDay[d.toISOString().split('T')[0]] = 0;
      }
      
      completionActivities.forEach(act => {
        const dateStr = act.createdAt.toISOString().split('T')[0];
        if (completedByDay[dateStr] !== undefined) {
          completedByDay[dateStr]++;
        }
      });

      const chartData = Object.keys(completedByDay).map(date => ({
        date,
        completed: completedByDay[date]
      }));

      // Project Completion %
      const projectCompletion = await Promise.all(projects.map(async p => {
        const total = await prisma.task.count({ where: { projectId: p.id } });
        const done = await prisma.task.count({ where: { projectId: p.id, status: 'DONE' } });
        return {
          id: p.id,
          name: p.name,
          percentage: total === 0 ? 0 : Math.round((done / total) * 100)
        };
      }));

      // Streak calculation
      const userCompletionActivities = await prisma.activity.findMany({
        where: {
          userId,
          action: 'STATUS_CHANGED',
          newValue: 'DONE'
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      });

      let currentStreak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);

      const uniqueCompletionDates = new Set(userCompletionActivities.map(act => {
        const d = new Date(act.createdAt);
        return d.toISOString().split('T')[0];
      }));

      const todayStr = checkDate.toISOString().split('T')[0];
      const yesterdayDate = new Date(checkDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      if (uniqueCompletionDates.has(todayStr) || uniqueCompletionDates.has(yesterdayStr)) {
        let cur = uniqueCompletionDates.has(todayStr) ? checkDate : yesterdayDate;
        while (true) {
          const curStr = cur.toISOString().split('T')[0];
          if (uniqueCompletionDates.has(curStr)) {
            currentStreak++;
            cur.setDate(cur.getDate() - 1);
          } else {
            break;
          }
        }
      }

      res.json({
        totalTasks,
        completedTasks,
        overdueTasks,
        currentStreak,
        chartData,
        projectCompletion
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
}

export const analyticsController = new AnalyticsController();
