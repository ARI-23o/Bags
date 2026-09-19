import express from 'express';
import {
  getCollections,
  getCollectionBySlug,
  getAdminCollections,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getCollections);
router.get('/:slug', getCollectionBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminCollections);
router.post('/', protectAdmin, createCollection);
router.put('/:id', protectAdmin, updateCollection);
router.delete('/:id', protectAdmin, deleteCollection);

export default router;
