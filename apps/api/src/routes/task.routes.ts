import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/projects/:projectId/tasks', taskController.getTasks.bind(taskController));
router.post('/projects/:projectId/tasks', taskController.createTask.bind(taskController));
router.patch('/tasks/:id', taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

export const taskRoutes = router;
