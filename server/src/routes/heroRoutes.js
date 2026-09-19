import express from 'express';
import {
  getActiveHeroSlides,
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide
} from '../controllers/heroController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getActiveHeroSlides);

// Admin
router.get('/admin/all', protectAdmin, getAdminHeroSlides);
router.post('/', protectAdmin, createHeroSlide);
router.put('/:id', protectAdmin, updateHeroSlide);
router.delete('/:id', protectAdmin, deleteHeroSlide);

export default router;
