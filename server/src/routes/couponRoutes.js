import express from 'express';
import {
  validateCoupon,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/validate', validateCoupon);

// Admin
router.get('/admin/all', protectAdmin, getAdminCoupons);
router.post('/', protectAdmin, createCoupon);
router.put('/:id', protectAdmin, updateCoupon);
router.delete('/:id', protectAdmin, deleteCoupon);

export default router;
