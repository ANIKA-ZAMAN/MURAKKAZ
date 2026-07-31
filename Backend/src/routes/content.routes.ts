import { Router } from 'express';
import { getContent } from '../controllers/content.controller';
const router = Router();
router.get('/:key', getContent);
export default router;
