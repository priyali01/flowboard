import { Router } from 'express';
import { LabelController } from '../controllers/label.controller';

const router = Router();

router.get('/', LabelController.getLabels);
router.post('/', LabelController.createLabel);
router.patch('/:id', LabelController.updateLabel);
router.delete('/:id', LabelController.deleteLabel);

export default router;
