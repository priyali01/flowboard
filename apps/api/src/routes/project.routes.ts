import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.getProjects.bind(projectController));
router.post('/', projectController.createProject.bind(projectController));
router.patch('/:id', projectController.updateProject.bind(projectController));
router.delete('/:id', projectController.deleteProject.bind(projectController));

export const projectRoutes = router;
