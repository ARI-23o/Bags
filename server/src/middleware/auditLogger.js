import AuditLog from '../models/AuditLog.js';

export const logAudit = async (req, action, targetResource, targetId = null, details = {}) => {
  try {
    const adminId = req.admin ? req.admin._id : null;
    const adminEmail = req.admin ? req.admin.email : 'system';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await AuditLog.create({
      adminId,
      adminEmail,
      action,
      targetResource,
      targetId: targetId ? targetId.toString() : null,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('[AuditLog] Günlük kaydı oluşturulamadı:', error.message);
  }
};
