import { query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { formatProduct } from '../utils/dbHelpers.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      collection,
      minPrice,
      maxPrice,
      color,
      material,
      inStock,
      isFeatured,
      isNewArrival,
      isSale,
      status = 'active',
      search,
      sort = 'recommended',
      page = 1,
      limit = 24
    } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Status filter
    if (status && status !== 'all') {
      conditions.push(`p.status = $${paramIndex++}`);
      params.push(status);
    }

    // Category filter by slug or ID
    if (category) {
      if (!isNaN(category)) {
        conditions.push(`p.category_id = $${paramIndex++}`);
        params.push(parseInt(category, 10));
      } else {
        conditions.push(`cat.slug = $${paramIndex++}`);
        params.push(category);
      }
    }

    // Collection filter by slug or ID
    if (collection) {
      if (!isNaN(collection)) {
        conditions.push(`p.collection_id = $${paramIndex++}`);
        params.push(parseInt(collection, 10));
      } else {
        conditions.push(`col.slug = $${paramIndex++}`);
        params.push(collection);
      }
    }

    // Price range
    if (minPrice) {
      conditions.push(`p.price >= $${paramIndex++}`);
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push(`p.price <= $${paramIndex++}`);
      params.push(parseFloat(maxPrice));
    }

    // Material
    if (material) {
      conditions.push(`p.material ILIKE $${paramIndex++}`);
      params.push(`%${material}%`);
    }

    // In Stock
    if (inStock === 'true') {
      conditions.push(`p.stock > 0`);
    }

    // Badges
    if (isFeatured === 'true') {
      conditions.push(`p.is_featured = TRUE`);
    }
    if (isNewArrival === 'true') {
      conditions.push(`p.is_new_arrival = TRUE`);
    }
    if (isSale === 'true') {
      conditions.push(`(p.is_sale = TRUE OR (p.compare_price IS NOT NULL AND p.compare_price > p.price))`);
    }

    // Color filter inside JSONB array
    if (color) {
      conditions.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements(p.colors) AS elem
        WHERE LOWER(elem->>'name') = LOWER($${paramIndex++})
      )`);
      params.push(color);
    }

    // Search filter
    if (search) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex} OR p.material ILIKE $${paramIndex})`);
      params.push(searchTerm);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'p.created_at DESC';
    if (sort === 'price-asc') orderBy = 'p.price ASC';
    else if (sort === 'price-desc') orderBy = 'p.price DESC';
    else if (sort === 'newest') orderBy = 'p.created_at DESC';
    else if (sort === 'title-asc') orderBy = 'p.title ASC';
    else if (sort === 'title-desc') orderBy = 'p.title DESC';

    // Count query
    const countSql = `
      SELECT COUNT(p.id) as total
      FROM products p
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN collections col ON col.id = p.collection_id
      ${whereClause}
    `;
    const countRes = await query(countSql, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // Data query
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const dataSql = `
      SELECT p.*,
             cat.name as category_name, cat.slug as category_slug, cat.image as category_image,
             col.name as collection_name, col.slug as collection_slug, col.banner_image as collection_banner_image
      FROM products p
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN collections col ON col.id = p.collection_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const dataRes = await query(dataSql, [...params, parseInt(limit, 10), offset]);
    const products = dataRes.rows.map((row) => formatProduct(row));

    // Dynamic Filter Options for colors & materials
    const filterOptionsRes = await query(`
      SELECT DISTINCT p.material, p.colors
      FROM products p
      WHERE p.status = 'active'
    `);

    const colorsMap = new Map();
    const materialsSet = new Set();

    filterOptionsRes.rows.forEach(r => {
      if (r.material) materialsSet.add(r.material);
      const cols = Array.isArray(r.colors) ? r.colors : (typeof r.colors === 'string' ? JSON.parse(r.colors) : []);
      cols.forEach(c => {
        if (c.name && !colorsMap.has(c.name)) {
          colorsMap.set(c.name, { name: c.name, hexCode: c.hexCode || '#191817' });
        }
      });
    });

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      filterOptions: {
        colors: Array.from(colorsMap.values()),
        materials: Array.from(materialsSet)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ success: true, products: [], categories: [] });
    }

    const term = `%${q.trim()}%`;
    const prodRes = await query(
      `SELECT id, title, slug, price, primary_image FROM products
       WHERE (title ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1) AND status = 'active'
       LIMIT 6`,
      [term]
    );

    const catRes = await query(
      `SELECT id, name, slug FROM categories WHERE name ILIKE $1 AND is_active = TRUE LIMIT 4`,
      [term]
    );

    res.json({
      success: true,
      products: prodRes.rows.map(r => ({
        _id: String(r.id),
        title: r.title,
        slug: r.slug,
        price: parseFloat(r.price),
        primaryImage: r.primary_image
      })),
      categories: catRes.rows.map(r => ({
        _id: String(r.id),
        name: r.name,
        slug: r.slug
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 50 } = req.query;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex})`);
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (category && category !== 'all') {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(parseInt(category, 10));
    }

    if (status && status !== 'all') {
      conditions.push(`p.status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const countRes = await query(`SELECT COUNT(p.id) as total FROM products p ${whereClause}`, params);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    const sql = `
      SELECT p.*,
             cat.name as category_name, cat.slug as category_slug,
             col.name as collection_name, col.slug as collection_slug
      FROM products p
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN collections col ON col.id = p.collection_id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const dataRes = await query(sql, [...params, parseInt(limit, 10), offset]);
    const products = dataRes.rows.map(formatProduct);

    res.json({
      success: true,
      products,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let sql = `
      SELECT p.*,
             cat.name as category_name, cat.slug as category_slug, cat.image as category_image,
             col.name as collection_name, col.slug as collection_slug, col.banner_image as collection_banner_image
      FROM products p
      LEFT JOIN categories cat ON cat.id = p.category_id
      LEFT JOIN collections col ON col.id = p.collection_id
      WHERE (p.slug = $1 OR p.id::text = $1)
    `;

    const result = await query(sql, [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
    }

    const product = formatProduct(result.rows[0]);

    // Related products (same category or featured)
    const relatedRes = await query(
      `SELECT p.*,
              cat.name as category_name, cat.slug as category_slug
       FROM products p
       LEFT JOIN categories cat ON cat.id = p.category_id
       WHERE p.id != $1 AND (p.category_id = $2 OR p.is_featured = TRUE) AND p.status = 'active'
       LIMIT 4`,
      [result.rows[0].id, result.rows[0].category_id]
    );
    const related = relatedRes.rows.map((r) => formatProduct(r));

    res.json({ success: true, product, related });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      sku,
      category,
      collectionId,
      price,
      comparePrice,
      costPrice,
      stock,
      images,
      colors,
      shortDescription,
      description,
      material,
      dimensions,
      strapType,
      closure,
      interiorDetails,
      careInstructions,
      tags,
      isNewArrival,
      isFeatured,
      isSale,
      status
    } = req.body;

    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    const existing = await query('SELECT id FROM products WHERE slug = $1', [finalSlug]);
    if (existing.rows.length > 0) {
      finalSlug = `${baseSlug}-${Date.now()}`;
    }

    const imgs = Array.isArray(images) ? images : [];
    const primaryImage = imgs[0] || '';
    const secondaryImage = imgs[1] || '';

    let catId = null;
    if (category) {
      if (!isNaN(category)) catId = parseInt(category, 10);
      else {
        const c = await query('SELECT id FROM categories WHERE slug = $1', [category]);
        if (c.rows.length > 0) catId = c.rows[0].id;
      }
    }

    let colId = null;
    if (collectionId) {
      if (!isNaN(collectionId)) colId = parseInt(collectionId, 10);
      else {
        const cl = await query('SELECT id FROM collections WHERE slug = $1', [collectionId]);
        if (cl.rows.length > 0) colId = cl.rows[0].id;
      }
    }

    const discountPercentage = (comparePrice && comparePrice > price)
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

    const stockStatus = stock <= 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock';

    const insertSql = `
      INSERT INTO products (
        title, slug, sku, category_id, collection_id, price, compare_price, cost_price,
        stock, images, primary_image, secondary_image, colors, short_description,
        description, material, dimensions, strap_type, closure, interior_details,
        care_instructions, tags, is_new_arrival, is_featured, is_sale, status,
        discount_percentage, stock_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26,
        $27, $28
      ) RETURNING *
    `;

    const insertRes = await query(insertSql, [
      title,
      finalSlug,
      sku || `NC-${Date.now()}`,
      catId,
      colId,
      parseFloat(price),
      comparePrice ? parseFloat(comparePrice) : null,
      costPrice ? parseFloat(costPrice) : null,
      parseInt(stock, 10) || 0,
      JSON.stringify(imgs),
      primaryImage,
      secondaryImage,
      JSON.stringify(colors || []),
      shortDescription || '',
      description || '',
      material || '',
      JSON.stringify(dimensions || {}),
      strapType || '',
      closure || '',
      interiorDetails || '',
      careInstructions || '',
      JSON.stringify(tags || []),
      isNewArrival || false,
      isFeatured || false,
      isSale || false,
      status || 'active',
      discountPercentage,
      stockStatus
    ]);

    res.status(201).json({ success: true, product: formatProduct(insertRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingRes = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
    }

    const current = existingRes.rows[0];
    const data = req.body;

    let slug = current.slug;
    if (data.title && data.title !== current.title) {
      slug = slugify(data.title);
    }

    let catId = current.category_id;
    if (data.category !== undefined) {
      if (!data.category) catId = null;
      else if (!isNaN(data.category)) catId = parseInt(data.category, 10);
      else {
        const c = await query('SELECT id FROM categories WHERE slug = $1', [data.category]);
        if (c.rows.length > 0) catId = c.rows[0].id;
      }
    }

    let colId = current.collection_id;
    if (data.collectionId !== undefined) {
      if (!data.collectionId) colId = null;
      else if (!isNaN(data.collectionId)) colId = parseInt(data.collectionId, 10);
      else {
        const cl = await query('SELECT id FROM collections WHERE slug = $1', [data.collectionId]);
        if (cl.rows.length > 0) colId = cl.rows[0].id;
      }
    }

    const imgs = data.images !== undefined ? data.images : (typeof current.images === 'string' ? JSON.parse(current.images) : current.images);
    const primaryImage = imgs[0] || current.primary_image;
    const secondaryImage = imgs[1] || current.secondary_image;

    const price = data.price !== undefined ? parseFloat(data.price) : parseFloat(current.price);
    const comparePrice = data.comparePrice !== undefined ? (data.comparePrice ? parseFloat(data.comparePrice) : null) : current.compare_price;
    const stock = data.stock !== undefined ? parseInt(data.stock, 10) : current.stock;

    const discountPercentage = (comparePrice && comparePrice > price)
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

    const stockStatus = stock <= 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock';

    const updateSql = `
      UPDATE products
      SET title = COALESCE($1, title),
          slug = $2,
          sku = COALESCE($3, sku),
          category_id = $4,
          collection_id = $5,
          price = $6,
          compare_price = $7,
          cost_price = COALESCE($8, cost_price),
          stock = $9,
          images = $10,
          primary_image = $11,
          secondary_image = $12,
          colors = COALESCE($13, colors),
          short_description = COALESCE($14, short_description),
          description = COALESCE($15, description),
          material = COALESCE($16, material),
          dimensions = COALESCE($17, dimensions),
          strap_type = COALESCE($18, strap_type),
          closure = COALESCE($19, closure),
          interior_details = COALESCE($20, interior_details),
          care_instructions = COALESCE($21, care_instructions),
          tags = COALESCE($22, tags),
          is_new_arrival = COALESCE($23, is_new_arrival),
          is_featured = COALESCE($24, is_featured),
          is_sale = COALESCE($25, is_sale),
          status = COALESCE($26, status),
          discount_percentage = $27,
          stock_status = $28,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $29
      RETURNING *
    `;

    const updateRes = await query(updateSql, [
      data.title,
      slug,
      data.sku,
      catId,
      colId,
      price,
      comparePrice,
      data.costPrice ? parseFloat(data.costPrice) : null,
      stock,
      JSON.stringify(imgs),
      primaryImage,
      secondaryImage,
      data.colors ? JSON.stringify(data.colors) : null,
      data.shortDescription,
      data.description,
      data.material,
      data.dimensions ? JSON.stringify(data.dimensions) : null,
      data.strapType,
      data.closure,
      data.interiorDetails,
      data.careInstructions,
      data.tags ? JSON.stringify(data.tags) : null,
      data.isNewArrival,
      data.isFeatured,
      data.isSale,
      data.status,
      discountPercentage,
      stockStatus,
      id
    ]);

    res.json({ success: true, product: formatProduct(updateRes.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
    }
    res.json({ success: true, message: 'Ürün başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};
