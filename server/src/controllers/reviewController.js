import { query } from '../config/db.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await query(
      `SELECT r.*, p.title as product_title
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       WHERE (r.product_id = $1 OR p.slug = $1::text) AND r.is_approved = TRUE
       ORDER BY r.created_at DESC`,
      [isNaN(productId) ? 0 : parseInt(productId, 10)]
    );

    const reviews = result.rows.map(r => ({
      _id: String(r.id),
      productId: String(r.product_id),
      productTitle: r.product_title,
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.is_approved,
      createdAt: r.created_at
    }));

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, author, rating, comment } = req.body;
    let prodId = parseInt(productId, 10);
    if (isNaN(prodId)) {
      const p = await query('SELECT id FROM products WHERE slug = $1', [productId]);
      if (p.rows.length > 0) prodId = p.rows[0].id;
    }

    const result = await query(
      `INSERT INTO reviews (product_id, author, rating, comment, is_approved)
       VALUES ($1, $2, $3, $4, FALSE)
       RETURNING *`,
      [prodId, author, parseInt(rating, 10), comment]
    );

    res.status(201).json({
      success: true,
      message: 'Değerlendirmeniz alındı. Moderasyon onayından sonra yayınlanacaktır.',
      review: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const submitReview = createReview;

export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT r.*, p.title as product_title
       FROM reviews r
       LEFT JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC`
    );

    const reviews = result.rows.map(r => ({
      _id: String(r.id),
      productId: String(r.product_id),
      productTitle: r.product_title || 'Silinmiş Ürün',
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.is_approved,
      createdAt: r.created_at
    }));

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const getAdminReviews = getAllReviewsAdmin;

export const updateAdminReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const result = await query(
      'UPDATE reviews SET is_approved = $1 WHERE id = $2 RETURNING *',
      [isApproved, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Yorum bulunamadı.' });
    }

    res.json({ success: true, review: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = updateAdminReviewStatus;
