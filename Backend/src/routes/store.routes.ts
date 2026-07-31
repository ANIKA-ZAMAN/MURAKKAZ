import { Router } from 'express';
import { listStores } from '../controllers/store.controller';
const router = Router();
router.get('/', listStores);
export default router;
