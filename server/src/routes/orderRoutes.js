import express from 'express';
import {
  createOrder,
  trackOrder,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getAdminDashboardStats
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/', createOrder);
router.get('/track', trackOrder);

// Admin
router.get('/admin/stats', protectAdmin, getAdminDashboardStats);
router.get('/admin/all', protectAdmin, getAdminOrders);
router.get('/admin/:id', protectAdmin, getAdminOrderById);
router.put('/admin/:id', protectAdmin, updateAdminOrderStatus);

export default router;
