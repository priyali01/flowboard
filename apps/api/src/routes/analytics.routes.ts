import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();
// User-based analytics (no workspace required)
router.get('/analytics', analyticsController.getDashboardMetrics.bind(analyticsController));

export default router;
