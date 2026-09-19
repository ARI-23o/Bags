import express from 'express';
import {
  getProductReviews,
  submitReview,
  getAdminReviews,
  updateAdminReviewStatus
} from '../controllers/reviewController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);
router.post('/', submitReview);

// Admin
router.get('/admin/all', protectAdmin, getAdminReviews);
router.put('/admin/:id', protectAdmin, updateAdminReviewStatus);

export default router;
