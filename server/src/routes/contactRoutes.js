import express from 'express';
import {
  submitContactMessage,
  getAdminContactMessages,
  updateAdminContactStatus
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.post('/', submitContactMessage);

// Admin
router.get('/admin/all', protectAdmin, getAdminContactMessages);
router.put('/admin/:id', protectAdmin, updateAdminContactStatus);

export default router;
