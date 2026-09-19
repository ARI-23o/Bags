import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import { slugifyTurkish } from '../utils/slugify.js';
import { logAudit } from '../middleware/auditLogger.js';

// @desc    Get all products with advanced filtering & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      collection,
      minPrice,
      maxPrice,
      color,
      material,
      inStock,
      isNewArrival,
      isSale,
      isFeatured,
      sort = 'recommended'
    } = req.query;

    const query = { status: 'active' };

    // Search query
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { title: regex },
        { sku: regex },
        { shortDescription: regex },
        { description: regex },
        { material: regex },
        { tags: regex }
      ];
    }

    // Category filter by slug or ID
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) query.category = catDoc._id;
        else query.category = null; // force empty if category not found
      }
    }

    // Collection filter by slug or ID
    if (collection) {
      if (collection.match(/^[0-9a-fA-F]{24}$/)) {
        query.collectionId = collection;
      } else {
        const colDoc = await Collection.findOne({ slug: collection });
        if (colDoc) query.collectionId = colDoc._id;
        else query.collectionId = null;
      }
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Color filter
    if (color) {
      query['colors.name'] = new RegExp(color, 'i');
    }

    // Material filter
    if (material) {
      query.material = new RegExp(material, 'i');
    }

    // In Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Flags
    if (isNewArrival === 'true' || isNewArrival === true) query.isNewArrival = true;
    if (isSale === 'true' || isSale === true) query.isSale = true;
    if (isFeatured === 'true' || isFeatured === true) query.isFeatured = true;

    // Sorting
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { title: 1 };
        break;
      case 'name_desc':
        sortOption = { title: -1 };
        break;
      case 'recommended':
      default:
        sortOption = { isFeatured: -1, createdAt: -1 };
        break;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collectionId', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Extract available filter values for dynamic shop sidebar
    const activeProducts = await Product.find({ status: 'active' }).select('colors material price');
    const allMaterials = [...new Set(activeProducts.map(p => p.material).filter(Boolean))];
    const allColors = [];
    const colorMap = new Map();
    activeProducts.forEach(p => {
      p.colors?.forEach(c => {
        if (c.name && !colorMap.has(c.name.toLowerCase())) {
          colorMap.set(c.name.toLowerCase(), { name: c.name, hexCode: c.hexCode });
        }
      });
    });
    colorMap.forEach(v => allColors.push(v));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      filterOptions: {
        materials: allMaterials,
        colors: allColors
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug description')
      .populate('collectionId', 'name slug subtitle');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Aradığınız ürün bulunamadı veya satıştan kaldırılmış olabilir.'
      });
    }

    // Get related products from same category or collection
    const related = await Product.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: [
        { category: product.category?._id },
        { collectionId: product.collectionId?._id }
      ]
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      product,
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search suggestions autocomplete
// @route   GET /api/products/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const products = await Product.find({
      status: 'active',
      $or: [{ title: regex }, { sku: regex }, { tags: regex }]
    })
      .select('title slug price primaryImage sku')
      .limit(5);

    const categories = await Category.find({ name: regex, isActive: true })
      .select('name slug')
      .limit(3);

    res.status(200).json({
      success: true,
      suggestions: {
        products,
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN PRODUCT CONTROLLERS =================

// @desc    Admin: Get all products (including drafts)
// @route   GET /api/products/admin/all
// @access  Private (Admin)
export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, status, sort = 'newest' } = req.query;
    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { sku: regex }];
    }

    if (category) query.category = category;
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collectionId', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (!data.slug && data.title) {
      data.slug = slugifyTurkish(data.title);
    }

    // Check slug uniqueness
    const existingSlug = await Product.findOne({ slug: data.slug });
    if (existingSlug) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Fallback images
    if (!data.primaryImage && data.images && data.images.length > 0) {
      data.primaryImage = data.images[0];
    }
    if (!data.secondaryImage && data.images && data.images.length > 1) {
      data.secondaryImage = data.images[1];
    }

    const product = await Product.create(data);
    await logAudit(req, 'CREATE_PRODUCT', 'Product', product._id, { title: product.title, sku: product.sku });

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (data.title && !data.slug) {
      data.slug = slugifyTurkish(data.title);
    }

    // Check slug collision with other products
    if (data.slug) {
      const existingSlug = await Product.findOne({ slug: data.slug, _id: { $ne: req.params.id } });
      if (existingSlug) {
        data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    if (!data.primaryImage && data.images && data.images.length > 0) {
      data.primaryImage = data.images[0];
    }
    if (!data.secondaryImage && data.images && data.images.length > 1) {
      data.secondaryImage = data.images[1];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
    }

    await logAudit(req, 'UPDATE_PRODUCT', 'Product', product._id, { title: product.title, sku: product.sku });

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
    }

    await logAudit(req, 'DELETE_PRODUCT', 'Product', req.params.id, { title: product.title, sku: product.sku });

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla silindi.'
    });
  } catch (error) {
    next(error);
  }
};
