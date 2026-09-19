import express from 'express';
import {
  getPublicSettings,
  updateAdminSettings
} from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getPublicSettings);

// Admin
router.put('/admin', protectAdmin, updateAdminSettings);

export default router;
