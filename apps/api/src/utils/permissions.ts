import { prisma } from '../db';

export const verifyProjectAccess = async (projectId: string, userId: string, requiresWrite = false): Promise<boolean> => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return false;
  
  if (project.workspaceId) {
    const member = await prisma.workspaceMember.findUnique({ 
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } } 
    });
    if (!member) return false;
    if (requiresWrite && member.role === 'VIEWER') return false;
    return true;
  }
  
  return project.ownerId === userId;
};
