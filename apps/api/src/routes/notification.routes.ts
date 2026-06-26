import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/notifications', notificationController.getNotifications.bind(notificationController));
router.patch('/notifications/:id/read', notificationController.markAsRead.bind(notificationController));

export default router;
