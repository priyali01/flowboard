import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/tasks/:taskId/activity', activityController.getActivityFeed.bind(activityController));

export default router;
