import { Request, Response } from 'express';
import { prisma } from '../db';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export class ExportController {
  async exportTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = String(req.params.workspaceId);
      const format = String(req.query.format || 'csv');

      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } }
      });
      if (!member) return res.status(403).json({ error: 'Not authorized' });

      // Fetch all tasks for all projects in this workspace
      const projects = await prisma.project.findMany({ where: { workspaceId } });
      const projectIds = projects.map(p => p.id);

      const tasks = await prisma.task.findMany({
        where: { projectId: { in: projectIds } },
        include: {
          project: { select: { name: true } },
          assignee: { select: { name: true } },
          labels: { select: { name: true } }
        },
        orderBy: { dueDate: 'asc' }
      });

      const formattedData = tasks.map(t => ({
        Project: t.project.name,
        Title: t.title,
        Status: t.status,
        Priority: t.priority,
        DueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : 'None',
        Assignee: t.assignee?.name || 'Unassigned',
        Labels: t.labels.map(l => l.name).join(', ')
      }));

      if (format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(formattedData);
        res.header('Content-Type', 'text/csv');
        res.attachment('tasks_export.csv');
        return res.send(csv);
      } else if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        res.header('Content-Type', 'application/pdf');
        res.attachment('tasks_export.pdf');
        doc.pipe(res);

        doc.fontSize(20).text('Workspace Tasks Export', { align: 'center' });
        doc.moveDown();

        formattedData.forEach((row, index) => {
          doc.fontSize(12).font('Helvetica-Bold').text(`Task ${index + 1}: ${row.Title}`);
          doc.fontSize(10).font('Helvetica')
             .text(`Project: ${row.Project} | Status: ${row.Status} | Priority: ${row.Priority}`)
             .text(`Due: ${row.DueDate} | Assignee: ${row.Assignee}`)
             .text(`Labels: ${row.Labels}`);
          doc.moveDown();
        });

        doc.end();
      } else {
        res.status(400).json({ error: 'Unsupported format' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to export tasks' });
    }
  }
}

export const exportController = new ExportController();
