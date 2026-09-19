import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { formatCollection } from '../utils/dbHelpers.js';

export const getCollections = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM collections c
      LEFT JOIN products p ON p.collection_id = c.id AND p.status = 'active'
    `;
    const params = [];

    if (includeInactive !== 'true') {
      sql += ' WHERE c.is_active = TRUE';
    }

    sql += ' GROUP BY c.id ORDER BY c.order_index ASC, c.name ASC';

    const result = await query(sql, params);
    const collections = result.rows.map(formatCollection);

    res.json({ success: true, collections });
  } catch (error) {
    next(error);
  }
};

export const getAdminCollections = async (req, res, next) => {
  try {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM collections c
      LEFT JOIN products p ON p.collection_id = c.id
      GROUP BY c.id
      ORDER BY c.order_index ASC, c.name ASC
    `;
    const result = await query(sql);
    const collections = result.rows.map(formatCollection);
    res.json({ success: true, collections });
  } catch (error) {
    next(error);
  }
};

export const getCollectionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM collections c
       LEFT JOIN products p ON p.collection_id = c.id AND p.status = 'active'
       WHERE c.slug = $1
       GROUP BY c.id`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }

    res.json({ success: true, collection: formatCollection(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (req, res, next) => {
  try {
    const { name, subtitle, description, image, bannerImage, order, isFeatured, isActive } = req.body;
    let baseSlug = slugify(name);
    let finalSlug = baseSlug;

    const existing = await query('SELECT id FROM collections WHERE slug = $1', [finalSlug]);
    if (existing.rows.length > 0) {
      finalSlug = `${baseSlug}-${Date.now()}`;
    }

    const insertRes = await query(
      `INSERT INTO collections (name, slug, subtitle, description, image, banner_image, order_index, is_featured, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, finalSlug, subtitle || '', description || '', image || '', bannerImage || '', order || 0, isFeatured || false, isActive !== false]
    );

    res.status(201).json({ success: true, collection: formatCollection(insertRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subtitle, description, image, bannerImage, order, isFeatured, isActive } = req.body;

    const currentRes = await query('SELECT * FROM collections WHERE id = $1', [id]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }

    let slug = currentRes.rows[0].slug;
    if (name && name !== currentRes.rows[0].name) {
      slug = slugify(name);
    }

    const updateRes = await query(
      `UPDATE collections
       SET name = COALESCE($1, name),
           slug = $2,
           subtitle = COALESCE($3, subtitle),
           description = COALESCE($4, description),
           image = COALESCE($5, image),
           banner_image = COALESCE($6, banner_image),
           order_index = COALESCE($7, order_index),
           is_featured = COALESCE($8, is_featured),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, slug, subtitle, description, image, bannerImage, order, isFeatured, isActive, id]
    );

    res.json({ success: true, collection: formatCollection(updateRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM collections WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }
    res.json({ success: true, message: 'Koleksiyon başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
