import Review from '../models/Review.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    res.status(200).json({
      success: true,
      count: total,
      averageRating: Number(avgRating.toFixed(1)),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new product review
// @route   POST /api/reviews
// @access  Public
export const submitReview = async (req, res, next) => {
  try {
    const { product, name, email, rating, comment } = req.body;

    if (!product || !name || !email || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen ürün, isim, e-posta, puan ve yorum alanlarını eksiksiz doldurunuz.'
      });
    }

    const review = await Review.create({
      product,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      rating: Number(rating),
      comment: comment.trim(),
      status: 'pending' // requires admin moderation
    });

    res.status(201).json({
      success: true,
      message: 'Değerlendirmeniz alındı. Moderasyon onayının ardından yayınlanacaktır.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN REVIEW CONTROLLERS =================

// @desc    Admin: Get all reviews with status filter
// @route   GET /api/reviews/admin/all
// @access  Private (Admin)
export const getAdminReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const reviews = await Review.find(query)
      .populate('product', 'title sku primaryImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update review status (approve, reject)
// @route   PUT /api/reviews/admin/:id
// @access  Private (Admin)
export const updateAdminReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Yorum bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_REVIEW_STATUS', 'Review', review._id, { status });

    res.status(200).json({
      success: true,
      message: 'Yorum durumu güncellendi.',
      review
    });
  } catch (error) {
    next(error);
  }
};
