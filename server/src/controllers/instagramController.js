import InstagramPost from '../models/InstagramPost.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get active Instagram posts
// @route   GET /api/instagram
// @access  Public
export const getActiveInstagramPosts = async (req, res, next) => {
  try {
    const posts = await InstagramPost.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN INSTAGRAM CONTROLLERS =================

// @desc    Admin: Get all Instagram posts
// @route   GET /api/instagram/admin/all
// @access  Private (Admin)
export const getAdminInstagramPosts = async (req, res, next) => {
  try {
    const posts = await InstagramPost.find().sort({ order: 1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create post
// @route   POST /api/instagram
// @access  Private (Admin)
export const createInstagramPost = async (req, res, next) => {
  try {
    const post = await InstagramPost.create(req.body);
    await logAudit(req, 'CREATE_INSTAGRAM_POST', 'InstagramPost', post._id, { caption: post.caption });

    res.status(201).json({
      success: true,
      message: 'Instagram gönderisi eklendi.',
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update post
// @route   PUT /api/instagram/:id
// @access  Private (Admin)
export const updateInstagramPost = async (req, res, next) => {
  try {
    const post = await InstagramPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Gönderi bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_INSTAGRAM_POST', 'InstagramPost', post._id, { caption: post.caption });

    res.status(200).json({
      success: true,
      message: 'Instagram gönderisi güncellendi.',
      post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete post
// @route   DELETE /api/instagram/:id
// @access  Private (Admin)
export const deleteInstagramPost = async (req, res, next) => {
  try {
    const post = await InstagramPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Gönderi bulunamadı.' });
    }

    await logAudit(req, 'DELETE_INSTAGRAM_POST', 'InstagramPost', req.params.id, {});

    res.status(200).json({ success: true, message: 'Instagram gönderisi silindi.' });
  } catch (error) {
    next(error);
  }
};
