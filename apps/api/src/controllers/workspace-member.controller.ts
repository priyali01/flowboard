import { Request, Response } from 'express';
import { prisma } from '../db';
import { z } from 'zod';
import { socketService } from '../services/socket.service';

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

export class WorkspaceMemberController {
  async inviteMember(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = String(req.params.workspaceId);
      const { email, role } = inviteMemberSchema.parse(req.body);

      const currentMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } }
      });

      if (!currentMember || (currentMember.role !== 'OWNER' && currentMember.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Not authorized to invite members' });
      }

      const userToInvite = await prisma.user.findUnique({ where: { email } });
      if (!userToInvite) {
        return res.status(404).json({ error: 'User with this email not found' });
      }

      const existingMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: userToInvite.id } }
      });

      if (existingMember) {
        return res.status(400).json({ error: 'User is already a member of this workspace' });
      }

      const newMember = await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: userToInvite.id,
          role
        },
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } }
      });

      const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (workspace) {
        await prisma.notification.create({
          data: {
            userId: userToInvite.id,
            message: `You have been added to the workspace: ${workspace.name}`
          }
        });
        socketService.emitToUser(userToInvite.id, 'new_notification', {});
        socketService.emitToUser(userToInvite.id, 'workspace_invited', workspace);
      }

      res.status(201).json(newMember);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: 'Failed to invite member' });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const workspaceId = String(req.params.workspaceId);
      const memberId = String(req.params.memberId); 

      const currentMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } }
      });

      if (!currentMember) return res.status(403).json({ error: 'Not authorized' });
      
      if (userId !== memberId && currentMember.role !== 'OWNER' && currentMember.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to remove others' });
      }

      const memberToRemove = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: memberId } }
      });

      if (!memberToRemove) return res.status(404).json({ error: 'Member not found' });
      if (memberToRemove.role === 'OWNER') return res.status(400).json({ error: 'Cannot remove owner' });

      await prisma.workspaceMember.delete({
        where: { workspaceId_userId: { workspaceId, userId: memberId } }
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove member' });
    }
  }
}

export const workspaceMemberController = new WorkspaceMemberController();
