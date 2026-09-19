import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  adminLogout,
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
} from '../controllers/authController.js';
import { protectAdmin, protectUser } from '../middleware/auth.js';

const router = express.Router();

// Admin
router.post('/admin/login', adminLogin);
router.get('/admin/me', protectAdmin, getAdminProfile);
router.post('/admin/logout', adminLogout);

// Customer
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protectUser, getUserProfile);
router.post('/logout', logoutUser);

export default router;
