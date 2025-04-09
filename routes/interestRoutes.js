import express from 'express';
import { getAll, getById, create, update, remove } from '../controllers/interestController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAll); // Anyone can view interests
router.get('/:id', getById); // Anyone can view a specific interest

// Protected routes (admin only)
router.post('/', auth, isAdmin, create);        // Only admin can create
router.put('/:id', auth, isAdmin, update);      // Only admin can update
router.delete('/:id', auth, isAdmin, remove);   // Only admin can delete

export default router; 