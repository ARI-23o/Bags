import { query } from '../config/db.js';
import { formatWholesaleEnquiry } from '../utils/dbHelpers.js';

export const submitWholesaleEnquiry = async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      city,
      country,
      businessType,
      taxId,
      taxOffice,
      instagramHandle,
      website,
      estimatedVolume,
      message
    } = req.body;

    const insertSql = `
      INSERT INTO wholesale_enquiries (
        company_name, contact_name, email, phone, city, country,
        business_type, tax_id, tax_office, instagram_handle, website,
        estimated_volume, message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const insertRes = await query(insertSql, [
      companyName,
      contactName,
      email,
      phone,
      city,
      country || 'Türkiye',
      businessType,
      taxId || null,
      taxOffice || null,
      instagramHandle || null,
      website || null,
      estimatedVolume || null,
      message || ''
    ]);

    res.status(201).json({
      success: true,
      message: 'Toptan satış talebiniz başarıyla alındı. Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.',
      enquiry: formatWholesaleEnquiry(insertRes.rows[0])
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminWholesaleEnquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && status !== 'all') {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(id) as total FROM wholesale_enquiries ${whereClause}`, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const dataRes = await query(
      `SELECT * FROM wholesale_enquiries ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, parseInt(limit, 10), offset]
    );

    const enquiries = dataRes.rows.map(formatWholesaleEnquiry);

    res.json({
      success: true,
      enquiries,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};

export const getWholesaleEnquiries = getAdminWholesaleEnquiries;

export const updateAdminWholesaleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const result = await query(
      `UPDATE wholesale_enquiries
       SET status = COALESCE($1, status),
           admin_notes = COALESCE($2, admin_notes)
       WHERE id = $3
       RETURNING *`,
      [status, adminNotes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Talep bulunamadı.' });
    }

    res.json({ success: true, enquiry: formatWholesaleEnquiry(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateWholesaleStatus = updateAdminWholesaleStatus;
