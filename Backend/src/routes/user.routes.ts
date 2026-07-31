import { Router } from 'express';
import { getProfile, updateProfile, uploadPhoto, getPreferences, updatePreferences, getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema, updatePreferencesSchema, createAddressSchema, updateAddressSchema } from '../validators/user.validator';
import { uploadAvatar } from '../config/upload';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/me', getProfile);
router.put('/me', validate(updateProfileSchema), updateProfile);
router.put('/me/photo', uploadAvatar, uploadPhoto);
router.get('/me/preferences', getPreferences);
router.put('/me/preferences', validate(updatePreferencesSchema), updatePreferences);
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', validate(createAddressSchema), createAddress);
router.put('/me/addresses/:id', validate(updateAddressSchema), updateAddress);
router.delete('/me/addresses/:id', deleteAddress);

export default router;
