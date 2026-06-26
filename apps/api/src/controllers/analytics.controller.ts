import { Request, Response } from 'express';
import { prisma } from '../db';

export class AnalyticsController {
  async getDashboardMetrics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = String(req.params.workspaceId);

      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } }
      });
      if (!member) return res.status(403).json({ error: 'Not authorized' });

      // Get all projects in workspace
      const projects = await prisma.project.findMany({
        where: { workspaceId }
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

      // Using activities to find completion events
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
      // Initialize last 30 days with 0
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

      // Streak calculation (user specific within workspace, or global for user?)
      // Let's do user specific streak across all their tasks (simpler and more meaningful for the user)
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
      // Reset time to start of day for comparison
      checkDate.setHours(0, 0, 0, 0);

      // Create a Set of unique completion dates for the user
      const uniqueCompletionDates = new Set(userCompletionActivities.map(act => {
        const d = new Date(act.createdAt);
        // adjust to local timezone date string ideally, but UTC is fine for MVP
        return d.toISOString().split('T')[0];
      }));

      const todayStr = checkDate.toISOString().split('T')[0];
      const yesterdayDate = new Date(checkDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      if (uniqueCompletionDates.has(todayStr) || uniqueCompletionDates.has(yesterdayStr)) {
        // They have a streak going
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
