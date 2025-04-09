import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/adminController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', auth, isAdmin, getAllUsers);
router.delete('/users/:id', auth, isAdmin, deleteUser);

export default router;
