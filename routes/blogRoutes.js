import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  create,
  getAllBlogs,
  getBlogById,
  getBlogsByUser,
  update,
  deleteBlog,
  uploadImage
} from '../controllers/blogController.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/user/:userId', getBlogsByUser);
router.get('/:id', getBlogById);

// Protected routes
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteBlog);
router.post('/upload-image', auth, uploadImage);

export default router;