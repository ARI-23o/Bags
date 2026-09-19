import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugifyTurkish } from '../utils/slugify.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Attach product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, status: 'active' });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }

    const count = await Product.countDocuments({ category: category._id, status: 'active' });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN CATEGORY CONTROLLERS =================

// @desc    Admin: Get all categories (including inactive)
// @route   GET /api/categories/admin/all
// @access  Private (Admin)
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = slugifyTurkish(data.name);
    }

    const category = await Category.create(data);
    await logAudit(req, 'CREATE_CATEGORY', 'Category', category._id, { name: category.name });

    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu.',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.name && !data.slug) {
      data.slug = slugifyTurkish(data.name);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_CATEGORY', 'Category', category._id, { name: category.name });

    res.status(200).json({
      success: true,
      message: 'Kategori başarıyla güncellendi.',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    }

    await logAudit(req, 'DELETE_CATEGORY', 'Category', req.params.id, { name: category.name });

    res.status(200).json({ success: true, message: 'Kategori başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
