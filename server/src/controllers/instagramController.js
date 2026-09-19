import { query } from '../config/db.js';
import { formatInstagramPost } from '../utils/dbHelpers.js';

export const getInstagramPosts = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let sql = 'SELECT * FROM instagram_posts';
    if (includeInactive !== 'true') {
      sql += ' WHERE is_active = TRUE';
    }
    sql += ' ORDER BY order_index ASC, id ASC';

    const result = await query(sql);
    const posts = result.rows.map(formatInstagramPost);

    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const getActiveInstagramPosts = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM instagram_posts WHERE is_active = TRUE ORDER BY order_index ASC, id ASC');
    const posts = result.rows.map(formatInstagramPost);
    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const getAdminInstagramPosts = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM instagram_posts ORDER BY order_index ASC, id ASC');
    const posts = result.rows.map(formatInstagramPost);
    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const createInstagramPost = async (req, res, next) => {
  try {
    const { caption, mediaUrl, permalink, likeCount, order, isActive } = req.body;

    const result = await query(
      `INSERT INTO instagram_posts (caption, media_url, permalink, like_count, order_index, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [caption || '', mediaUrl, permalink || 'https://www.instagram.com/nehircanta2016/', likeCount || 0, order || 0, isActive !== false]
    );

    res.status(201).json({ success: true, post: formatInstagramPost(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateInstagramPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, mediaUrl, permalink, likeCount, order, isActive } = req.body;

    const result = await query(
      `UPDATE instagram_posts
       SET caption = COALESCE($1, caption),
           media_url = COALESCE($2, media_url),
           permalink = COALESCE($3, permalink),
           like_count = COALESCE($4, like_count),
           order_index = COALESCE($5, order_index),
           is_active = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING *`,
      [caption, mediaUrl, permalink, likeCount, order, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Instagram gönderisi bulunamadı.' });
    }

    res.json({ success: true, post: formatInstagramPost(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteInstagramPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM instagram_posts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Gönderi bulunamadı.' });
    }
    res.json({ success: true, message: 'Gönderi başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
