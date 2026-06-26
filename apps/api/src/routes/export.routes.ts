import { Router } from 'express';
import { exportController } from '../controllers/export.controller';

const router = Router();
router.get('/:workspaceId/export', exportController.exportTasks.bind(exportController));

export default router;
