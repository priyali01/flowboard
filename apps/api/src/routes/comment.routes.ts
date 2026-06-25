import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/tasks/:taskId/comments', commentController.getComments.bind(commentController));
router.post('/tasks/:taskId/comments', commentController.createComment.bind(commentController));
router.delete('/comments/:id', commentController.deleteComment.bind(commentController));

export default router;
