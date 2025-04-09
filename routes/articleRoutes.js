import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  create,
  getAllArticles,
  getArticleById,
  getArticlesByUser,
  update,
  deleteArticle
} from '../controllers/articleController.js';

const router = express.Router();

// Public routes
router.get('/', getAllArticles);
router.get('/user/:userId', getArticlesByUser);
router.get('/:id', getArticleById);

// Protected routes
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteArticle);

export default router;