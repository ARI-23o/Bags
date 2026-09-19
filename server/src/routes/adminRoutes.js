import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import Admin from '../models/Admin.js';
import { protectAdmin, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../middleware/auditLogger.js';

const router = express.Router();

// Audit logs
router.get('/audit-logs', protectAdmin, getAuditLogs);

// Admin users list (super_admin only)
router.get('/users', protectAdmin, authorizeRoles('super_admin'), async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    next(error);
  }
});

// Create new admin user (super_admin only)
router.post('/users', protectAdmin, authorizeRoles('super_admin'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Bu e-posta adresiyle kayıtlı bir yönetici mevcut.' });
    }

    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'admin'
    });

    await logAudit(req, 'CREATE_ADMIN_USER', 'Admin', newAdmin._id, { email: newAdmin.email, role: newAdmin.role });

    res.status(201).json({
      success: true,
      message: 'Yönetici hesabı oluşturuldu.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
