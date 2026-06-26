import { Router } from 'express';
import { templateController } from '../controllers/template.controller';

const router = Router();

router.get('/workspaces/:workspaceId/templates', templateController.getTemplates.bind(templateController));
router.post('/workspaces/:workspaceId/templates', (req, res) => {
  // Overwrite body with param
  req.body.workspaceId = req.params.workspaceId;
  return templateController.createTemplate(req, res);
});
router.delete('/templates/:id', templateController.deleteTemplate.bind(templateController));
router.post('/templates/:id/instantiate', templateController.instantiateTemplate.bind(templateController));

export default router;
