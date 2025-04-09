import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contactController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route for creating contact
router.post('/', createContact);

// Admin routes for managing contacts
router.get('/', auth, isAdmin, getAllContacts);
router.patch('/:id/status', auth, isAdmin, updateContactStatus);
router.delete('/:id', auth, isAdmin, deleteContact);

export default router;
