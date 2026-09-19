import { query } from '../config/db.js';

export const logAudit = async (req, action, entity, entityId = null, details = {}) => {
  try {
    const adminId = req.admin ? (req.admin.id || req.admin._id) : null;
    const adminEmail = req.admin ? req.admin.email : 'system';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    await query(
      `INSERT INTO audit_logs (admin_id, admin_email, action, entity, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        adminId && !isNaN(adminId) ? parseInt(adminId, 10) : null,
        adminEmail,
        action,
        entity,
        entityId ? String(entityId) : null,
        JSON.stringify(details),
        ipAddress
      ]
    );
  } catch (error) {
    console.error('[AuditLog] Günlük kaydı oluşturulamadı:', error.message);
  }
};
