import express from 'express';
import bcrypt from 'bcryptjs';
import { getAuditLogs } from '../controllers/auditController.js';
import { query } from '../config/db.js';
import { protectAdmin, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../middleware/auditLogger.js';

const router = express.Router();

// Audit logs
router.get('/audit-logs', protectAdmin, getAuditLogs);

// Admin users list (super_admin only)
router.get('/users', protectAdmin, authorizeRoles('super_admin'), async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, role, is_active, last_login, created_at FROM admins ORDER BY created_at DESC');
    const admins = result.rows.map(a => ({
      _id: String(a.id),
      id: a.id,
      name: a.name,
      email: a.email,
      role: a.role,
      isActive: a.is_active,
      lastLogin: a.last_login,
      createdAt: a.created_at
    }));
    res.status(200).json({ success: true, admins });
  } catch (error) {
    next(error);
  }
});

// Create new admin user (super_admin only)
router.post('/users', protectAdmin, authorizeRoles('super_admin'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await query('SELECT id FROM admins WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Bu e-posta adresiyle kayıtlı bir yönetici mevcut.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertRes = await query(
      `INSERT INTO admins (name, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase().trim(), hashedPassword, role || 'admin']
    );

    const newAdmin = insertRes.rows[0];

    await logAudit(req, 'CREATE_ADMIN_USER', 'Admin', newAdmin.id, { email: newAdmin.email, role: newAdmin.role });

    res.status(201).json({
      success: true,
      message: 'Yönetici hesabı oluşturuldu.',
      admin: {
        _id: String(newAdmin.id),
        id: newAdmin.id,
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
