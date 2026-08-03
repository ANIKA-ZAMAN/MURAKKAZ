import { Router } from 'express';
import { listEvents, getEvent, setReminder, subscribeNewsletter } from '../controllers/event.controller';
import { validate } from '../middleware/validate';
import { setReminderSchema } from '../validators/event.validator';
import { optionalAuth } from '../middleware/auth';
const router = Router();
router.get('/', listEvents);
router.post('/subscribe', subscribeNewsletter);
router.get('/:slug', getEvent);
router.post('/:slug/remind', optionalAuth, validate(setReminderSchema), setReminder);
export default router;

