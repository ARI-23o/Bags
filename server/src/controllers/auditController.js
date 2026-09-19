import { query } from '../config/db.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const { entity, action, page = 1, limit = 50 } = req.query;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (entity) {
      conditions.push(`entity = $${paramIndex++}`);
      params.push(entity);
    }
    if (action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(action);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const countRes = await query(`SELECT COUNT(id) as total FROM audit_logs ${whereClause}`, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const result = await query(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, parseInt(limit, 10), offset]
    );

    const logs = result.rows.map(r => ({
      _id: String(r.id),
      adminId: r.admin_id,
      adminEmail: r.admin_email,
      action: r.action,
      entity: r.entity,
      entityId: r.entity_id,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details,
      ipAddress: r.ip_address,
      createdAt: r.created_at
    }));

    res.json({
      success: true,
      logs,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};
