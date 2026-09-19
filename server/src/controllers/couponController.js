import { query } from '../config/db.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Kupon kodu giriniz.' });
    }

    const result = await query(
      'SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND is_active = TRUE',
      [code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Geçersiz veya süresi dolmuş kupon kodu.' });
    }

    const coupon = result.rows[0];

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'Bu kuponun kullanım süresi dolmuştur.' });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Bu kupon kullanım limitine ulaşmıştır.' });
    }

    const currentSubtotal = parseFloat(subtotal || '0');
    if (coupon.min_spend && currentSubtotal < parseFloat(coupon.min_spend)) {
      return res.status(400).json({
        success: false,
        message: `Bu kuponu kullanabilmek için sepet tutarınız minimum ₺${coupon.min_spend} olmalıdır.`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (currentSubtotal * parseFloat(coupon.discount_value)) / 100;
    } else {
      discountAmount = Math.min(currentSubtotal, parseFloat(coupon.discount_value));
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
        discountAmount: Math.round(discountAmount * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCoupons = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    const coupons = result.rows.map(r => ({
      _id: String(r.id),
      code: r.code,
      discountType: r.discount_type,
      discountValue: parseFloat(r.discount_value),
      minSpend: parseFloat(r.min_spend || '0'),
      usageLimit: r.usage_limit,
      usedCount: r.used_count,
      isActive: r.is_active,
      expiresAt: r.expires_at,
      createdAt: r.created_at
    }));
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = getAdminCoupons;

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minSpend, usageLimit, isActive, expiresAt } = req.body;
    const result = await query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_spend, usage_limit, is_active, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [code.toUpperCase().trim(), discountType, parseFloat(discountValue), parseFloat(minSpend || 0), usageLimit || null, isActive !== false, expiresAt || null]
    );
    const r = result.rows[0];
    res.status(201).json({
      success: true,
      coupon: {
        _id: String(r.id),
        code: r.code,
        discountType: r.discount_type,
        discountValue: parseFloat(r.discount_value),
        minSpend: parseFloat(r.min_spend),
        usageLimit: r.usage_limit,
        usedCount: r.used_count,
        isActive: r.is_active,
        expiresAt: r.expires_at
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minSpend, usageLimit, isActive, expiresAt } = req.body;

    const result = await query(
      `UPDATE coupons
       SET code = COALESCE($1, code),
           discount_type = COALESCE($2, discount_type),
           discount_value = COALESCE($3, discount_value),
           min_spend = COALESCE($4, min_spend),
           usage_limit = COALESCE($5, usage_limit),
           is_active = COALESCE($6, is_active),
           expires_at = COALESCE($7, expires_at)
       WHERE id = $8
       RETURNING *`,
      [code ? code.toUpperCase().trim() : null, discountType, discountValue ? parseFloat(discountValue) : null, minSpend ? parseFloat(minSpend) : null, usageLimit, isActive, expiresAt, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kupon bulunamadı.' });
    }

    const r = result.rows[0];
    res.json({
      success: true,
      coupon: {
        _id: String(r.id),
        code: r.code,
        discountType: r.discount_type,
        discountValue: parseFloat(r.discount_value),
        minSpend: parseFloat(r.min_spend),
        usageLimit: r.usage_limit,
        usedCount: r.used_count,
        isActive: r.is_active,
        expiresAt: r.expires_at
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM coupons WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kupon bulunamadı.' });
    }
    res.json({ success: true, message: 'Kupon silindi.' });
  } catch (error) {
    next(error);
  }
};
