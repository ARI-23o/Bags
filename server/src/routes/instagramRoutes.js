import express from 'express';
import {
  getActiveInstagramPosts,
  getAdminInstagramPosts,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost
} from '../controllers/instagramController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getActiveInstagramPosts);

// Admin
router.get('/admin/all', protectAdmin, getAdminInstagramPosts);
router.post('/', protectAdmin, createInstagramPost);
router.put('/:id', protectAdmin, updateInstagramPost);
router.delete('/:id', protectAdmin, deleteInstagramPost);

export default router;
