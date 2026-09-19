import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { formatCategory } from '../utils/dbHelpers.js';

export const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
    `;
    const params = [];

    if (includeInactive !== 'true') {
      sql += ' WHERE c.is_active = TRUE';
    }

    sql += ' GROUP BY c.id ORDER BY c.order_index ASC, c.name ASC';

    const result = await query(sql, params);
    const categories = result.rows.map(formatCategory);

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.order_index ASC, c.name ASC
    `;
    const result = await query(sql);
    const categories = result.rows.map(formatCategory);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
       WHERE c.slug = $1
       GROUP BY c.id`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }

    res.json({ success: true, category: formatCategory(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, order, isActive } = req.body;
    let baseSlug = slugify(name);
    let finalSlug = baseSlug;

    const existing = await query('SELECT id FROM categories WHERE slug = $1', [finalSlug]);
    if (existing.rows.length > 0) {
      finalSlug = `${baseSlug}-${Date.now()}`;
    }

    const insertRes = await query(
      `INSERT INTO categories (name, slug, description, image, order_index, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, finalSlug, description || '', image || '', order || 0, isActive !== false]
    );

    res.status(201).json({ success: true, category: formatCategory(insertRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, order, isActive } = req.body;

    const currentRes = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }

    let slug = currentRes.rows[0].slug;
    if (name && name !== currentRes.rows[0].name) {
      slug = slugify(name);
    }

    const updateRes = await query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           slug = $2,
           description = COALESCE($3, description),
           image = COALESCE($4, image),
           order_index = COALESCE($5, order_index),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, slug, description, image, order, isActive, id]
    );

    res.json({ success: true, category: formatCategory(updateRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }
    res.json({ success: true, message: 'Kategori başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
