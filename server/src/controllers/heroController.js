import HeroSlide from '../models/HeroSlide.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get active hero slides
// @route   GET /api/hero
// @access  Public
export const getActiveHeroSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN HERO CONTROLLERS =================

// @desc    Admin: Get all slides
// @route   GET /api/hero/admin/all
// @access  Private (Admin)
export const getAdminHeroSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.status(200).json({ success: true, slides });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create slide
// @route   POST /api/hero
// @access  Private (Admin)
export const createHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.create(req.body);
    await logAudit(req, 'CREATE_HERO_SLIDE', 'HeroSlide', slide._id, { title: slide.title });

    res.status(201).json({
      success: true,
      message: 'Slayt başarıyla oluşturuldu.',
      slide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update slide
// @route   PUT /api/hero/:id
// @access  Private (Admin)
export const updateHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slayt bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_HERO_SLIDE', 'HeroSlide', slide._id, { title: slide.title });

    res.status(200).json({
      success: true,
      message: 'Slayt güncellendi.',
      slide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete slide
// @route   DELETE /api/hero/:id
// @access  Private (Admin)
export const deleteHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slayt bulunamadı.' });
    }

    await logAudit(req, 'DELETE_HERO_SLIDE', 'HeroSlide', req.params.id, { title: slide.title });

    res.status(200).json({ success: true, message: 'Slayt silindi.' });
  } catch (error) {
    next(error);
  }
};
