import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();
router.get('/:workspaceId/analytics', analyticsController.getDashboardMetrics.bind(analyticsController));

export default router;
