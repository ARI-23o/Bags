import { query } from '../config/db.js';
import { formatHeroSlide } from '../utils/dbHelpers.js';

export const getHeroSlides = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let sql = 'SELECT * FROM hero_slides';
    if (includeInactive !== 'true') {
      sql += ' WHERE is_active = TRUE';
    }
    sql += ' ORDER BY order_index ASC, id ASC';

    const result = await query(sql);
    const slides = result.rows.map(formatHeroSlide);

    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

export const getActiveHeroSlides = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM hero_slides WHERE is_active = TRUE ORDER BY order_index ASC, id ASC');
    const slides = result.rows.map(formatHeroSlide);
    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

export const getAdminHeroSlides = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM hero_slides ORDER BY order_index ASC, id ASC');
    const slides = result.rows.map(formatHeroSlide);
    res.json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

export const createHeroSlide = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      tagline,
      image,
      mobileImage,
      ctaPrimaryText,
      ctaPrimaryLink,
      ctaSecondaryText,
      ctaSecondaryLink,
      order,
      isActive
    } = req.body;

    const insertSql = `
      INSERT INTO hero_slides (
        title, subtitle, tagline, image, mobile_image,
        cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link,
        order_index, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await query(insertSql, [
      title,
      subtitle || '',
      tagline || '',
      image,
      mobileImage || '',
      ctaPrimaryText || '',
      ctaPrimaryLink || '',
      ctaSecondaryText || '',
      ctaSecondaryLink || '',
      order || 0,
      isActive !== false
    ]);

    res.status(201).json({ success: true, slide: formatHeroSlide(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      tagline,
      image,
      mobileImage,
      ctaPrimaryText,
      ctaPrimaryLink,
      ctaSecondaryText,
      ctaSecondaryLink,
      order,
      isActive
    } = req.body;

    const updateSql = `
      UPDATE hero_slides
      SET title = COALESCE($1, title),
          subtitle = COALESCE($2, subtitle),
          tagline = COALESCE($3, tagline),
          image = COALESCE($4, image),
          mobile_image = COALESCE($5, mobile_image),
          cta_primary_text = COALESCE($6, cta_primary_text),
          cta_primary_link = COALESCE($7, cta_primary_link),
          cta_secondary_text = COALESCE($8, cta_secondary_text),
          cta_secondary_link = COALESCE($9, cta_secondary_link),
          order_index = COALESCE($10, order_index),
          is_active = COALESCE($11, is_active)
      WHERE id = $12
      RETURNING *
    `;

    const result = await query(updateSql, [
      title,
      subtitle,
      tagline,
      image,
      mobileImage,
      ctaPrimaryText,
      ctaPrimaryLink,
      ctaSecondaryText,
      ctaSecondaryLink,
      order,
      isActive,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Slide bulunamadı.' });
    }

    res.json({ success: true, slide: formatHeroSlide(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteHeroSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM hero_slides WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Slide bulunamadı.' });
    }
    res.json({ success: true, message: 'Slide başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
