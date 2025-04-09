import express from 'express';
import { auth } from '../middleware/auth.js';
import { updateProfile, deleteAccount, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.put('/profile', auth, updateProfile);
router.delete('/me', auth, deleteAccount);
router.post('/change-password', auth, changePassword);

export default router;
