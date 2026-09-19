import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import { slugifyTurkish } from '../utils/slugify.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get all active collections
// @route   GET /api/collections
// @access  Public
export const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    const collectionsWithCount = await Promise.all(
      collections.map(async (col) => {
        const count = await Product.countDocuments({ collectionId: col._id, status: 'active' });
        return {
          ...col.toObject(),
          productCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      collections: collectionsWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get collection by slug
// @route   GET /api/collections/:slug
// @access  Public
export const getCollectionBySlug = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }

    const count = await Product.countDocuments({ collectionId: collection._id, status: 'active' });

    res.status(200).json({
      success: true,
      collection: {
        ...collection.toObject(),
        productCount: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN COLLECTION CONTROLLERS =================

// @desc    Admin: Get all collections
// @route   GET /api/collections/admin/all
// @access  Private (Admin)
export const getAdminCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, collections });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create collection
// @route   POST /api/collections
// @access  Private (Admin)
export const createCollection = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = slugifyTurkish(data.name);
    }

    const collection = await Collection.create(data);
    await logAudit(req, 'CREATE_COLLECTION', 'Collection', collection._id, { name: collection.name });

    res.status(201).json({
      success: true,
      message: 'Koleksiyon başarıyla oluşturuldu.',
      collection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update collection
// @route   PUT /api/collections/:id
// @access  Private (Admin)
export const updateCollection = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.name && !data.slug) {
      data.slug = slugifyTurkish(data.name);
    }

    const collection = await Collection.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_COLLECTION', 'Collection', collection._id, { name: collection.name });

    res.status(200).json({
      success: true,
      message: 'Koleksiyon başarıyla güncellendi.',
      collection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete collection
// @route   DELETE /api/collections/:id
// @access  Private (Admin)
export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Koleksiyon bulunamadı.' });
    }

    await logAudit(req, 'DELETE_COLLECTION', 'Collection', req.params.id, { name: collection.name });

    res.status(200).json({ success: true, message: 'Koleksiyon başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
