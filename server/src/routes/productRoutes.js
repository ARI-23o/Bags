import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getSearchSuggestions,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/:slug', getProductBySlug);

// Admin
router.get('/admin/all', protectAdmin, getAdminProducts);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
