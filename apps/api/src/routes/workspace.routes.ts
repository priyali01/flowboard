import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller';
import { workspaceMemberController } from '../controllers/workspace-member.controller';

const router = Router();

router.get('/', workspaceController.getWorkspaces.bind(workspaceController));
router.post('/', workspaceController.createWorkspace.bind(workspaceController));

router.post('/:workspaceId/members', workspaceMemberController.inviteMember.bind(workspaceMemberController));
router.delete('/:workspaceId/members/:memberId', workspaceMemberController.removeMember.bind(workspaceMemberController));

export default router;
