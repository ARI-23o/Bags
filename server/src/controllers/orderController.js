import { query } from '../config/db.js';
import { formatOrder } from '../utils/dbHelpers.js';

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && status !== 'all') {
      conditions.push(`order_status = $${paramIndex++}`);
      params.push(status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push(`payment_status = $${paramIndex++}`);
      params.push(paymentStatus);
    }

    if (search) {
      conditions.push(`(order_number ILIKE $${paramIndex} OR customer->>'email' ILIKE $${paramIndex} OR customer->>'firstName' ILIKE $${paramIndex} OR customer->>'lastName' ILIKE $${paramIndex} OR customer->>'phone' ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(id) as total FROM orders ${whereClause}`, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const sql = `
      SELECT * FROM orders
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const dataRes = await query(sql, [...params, parseInt(limit, 10), offset]);
    const orders = dataRes.rows.map(formatOrder);

    res.json({
      success: true,
      orders,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = getAdminOrders;

export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = isNaN(id)
      ? 'SELECT * FROM orders WHERE order_number = $1'
      : 'SELECT * FROM orders WHERE id = $1 OR order_number = $1';

    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    }

    res.json({ success: true, order: formatOrder(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = getAdminOrderById;

export const trackOrder = async (req, res, next) => {
  try {
    const data = { ...req.query, ...req.body };
    const orderNumber = data.orderNumber;
    const contact = data.contact || data.email || data.phone;

    if (!orderNumber || !contact) {
      return res.status(400).json({ success: false, message: 'Sipariş numarası ve iletişim bilgisi (e-posta veya telefon) zorunludur.' });
    }

    const cleanContact = contact.trim().toLowerCase();

    const result = await query(
      `SELECT * FROM orders
       WHERE UPPER(order_number) = UPPER($1) AND (
         LOWER(customer->>'email') = $2 OR
         LOWER(customer->>'phone') = $2 OR
         REPLACE(customer->>'phone', ' ', '') = REPLACE($2, ' ', '')
       )`,
      [orderNumber.trim(), cleanContact]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Belirtilen bilgilerle eşleşen sipariş bulunamadı.' });
    }

    res.json({ success: true, order: formatOrder(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      shippingFee,
      discountAmount,
      couponCode,
      total,
      paymentMethod,
      notes
    } = req.body;

    const orderNumber = `NC-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    const insertSql = `
      INSERT INTO orders (
        order_number, customer, shipping_address, items, subtotal, shipping_fee,
        discount_amount, coupon_code, total, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const insertRes = await query(insertSql, [
      orderNumber,
      JSON.stringify(customer),
      JSON.stringify(shippingAddress),
      JSON.stringify(items),
      parseFloat(subtotal),
      parseFloat(shippingFee || 0),
      parseFloat(discountAmount || 0),
      couponCode || null,
      parseFloat(total),
      paymentMethod || 'havale_eft',
      notes || ''
    ]);

    // Update stock for purchased products
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.product && !isNaN(item.product)) {
          await query('UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2', [item.quantity || 1, parseInt(item.product, 10)]);
        }
      }
    }

    res.status(201).json({ success: true, order: formatOrder(insertRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, trackingCarrier, adminNotes } = req.body;

    const updateSql = `
      UPDATE orders
      SET order_status = COALESCE($1, order_status),
          payment_status = COALESCE($2, payment_status),
          tracking_number = COALESCE($3, tracking_number),
          tracking_carrier = COALESCE($4, tracking_carrier),
          admin_notes = COALESCE($5, admin_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const updateRes = await query(updateSql, [
      orderStatus,
      paymentStatus,
      trackingNumber,
      trackingCarrier,
      adminNotes,
      id
    ]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    }

    res.json({ success: true, order: formatOrder(updateRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = updateAdminOrderStatus;

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const ordersRes = await query(`
      SELECT
        COUNT(id) as total_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' OR order_status = 'delivered' THEN total ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN order_status = 'processing' THEN 1 END) as processing_orders
      FROM orders
    `);

    const productsRes = await query(`
      SELECT
        COUNT(id) as total_products,
        COUNT(CASE WHEN stock <= 5 THEN 1 END) as low_stock_count
      FROM products
      WHERE status = 'active'
    `);

    const wholesaleRes = await query(`
      SELECT COUNT(id) as pending_wholesale
      FROM wholesale_enquiries
      WHERE status = 'pending'
    `);

    const recentOrdersRes = await query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(ordersRes.rows[0]?.total_orders || '0', 10),
        totalRevenue: parseFloat(ordersRes.rows[0]?.total_revenue || '0'),
        pendingOrders: parseInt(ordersRes.rows[0]?.pending_orders || '0', 10),
        processingOrders: parseInt(ordersRes.rows[0]?.processing_orders || '0', 10),
        totalProducts: parseInt(productsRes.rows[0]?.total_products || '0', 10),
        lowStockCount: parseInt(productsRes.rows[0]?.low_stock_count || '0', 10),
        pendingWholesale: parseInt(wholesaleRes.rows[0]?.pending_wholesale || '0', 10)
      },
      recentOrders: recentOrdersRes.rows.map(formatOrder)
    });
  } catch (error) {
    next(error);
  }
};
