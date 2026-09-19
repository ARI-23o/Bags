import express from 'express';
import {
  submitWholesaleEnquiry,
  getAdminWholesaleEnquiries,
  updateAdminWholesaleStatus
} from '../controllers/wholesaleController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/', submitWholesaleEnquiry);

// Admin
router.get('/admin/all', protectAdmin, getAdminWholesaleEnquiries);
router.put('/admin/:id', protectAdmin, updateAdminWholesaleStatus);

export default router;
