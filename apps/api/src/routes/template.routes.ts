import { Router } from 'express';
import { templateController } from '../controllers/template.controller';

const router = Router();

router.get('/templates', templateController.getTemplates.bind(templateController));
router.post('/templates', (req, res) => {
  return templateController.createTemplate(req, res);
});
router.delete('/templates/:id', templateController.deleteTemplate.bind(templateController));
router.post('/templates/:id/instantiate', templateController.instantiateTemplate.bind(templateController));

export default router;
