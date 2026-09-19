// Utility to format DB rows for frontend compatibility
export const formatCategory = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image || '',
    order: row.order_index,
    isActive: row.is_active,
    productCount: parseInt(row.product_count || '0', 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const formatCollection = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle || '',
    description: row.description || '',
    image: row.image || '',
    bannerImage: row.banner_image || '',
    order: row.order_index,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    productCount: parseInt(row.product_count || '0', 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const formatProduct = (row, categoryRow = null, collectionRow = null) => {
  if (!row) return null;

  const category = categoryRow
    ? formatCategory(categoryRow)
    : row.category_name
    ? {
        _id: String(row.category_id),
        name: row.category_name,
        slug: row.category_slug,
        image: row.category_image
      }
    : row.category || null;

  const collectionId = collectionRow
    ? formatCollection(collectionRow)
    : row.collection_name
    ? {
        _id: String(row.collection_id),
        name: row.collection_name,
        slug: row.collection_slug,
        bannerImage: row.collection_banner_image
      }
    : row.collection_id || null;

  return {
    _id: String(row.id),
    title: row.title,
    slug: row.slug,
    sku: row.sku,
    category,
    collectionId,
    price: parseFloat(row.price),
    comparePrice: row.compare_price ? parseFloat(row.compare_price) : null,
    costPrice: row.cost_price ? parseFloat(row.cost_price) : null,
    stock: parseInt(row.stock, 10) || 0,
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    primaryImage: row.primary_image || (Array.isArray(row.images) && row.images[0]) || '',
    secondaryImage: row.secondary_image || (Array.isArray(row.images) && row.images[1]) || '',
    colors: Array.isArray(row.colors) ? row.colors : (typeof row.colors === 'string' ? JSON.parse(row.colors) : []),
    shortDescription: row.short_description || '',
    description: row.description || '',
    material: row.material || '',
    dimensions: typeof row.dimensions === 'object' ? row.dimensions : (typeof row.dimensions === 'string' ? JSON.parse(row.dimensions) : {}),
    strapType: row.strap_type || '',
    closure: row.closure || '',
    interiorDetails: row.interior_details || '',
    careInstructions: row.care_instructions || '',
    tags: Array.isArray(row.tags) ? row.tags : (typeof row.tags === 'string' ? JSON.parse(row.tags) : []),
    isNewArrival: row.is_new_arrival,
    isFeatured: row.is_featured,
    isSale: row.is_sale,
    status: row.status || 'active',
    discountPercentage: row.discount_percentage || 0,
    stockStatus: row.stock_status || 'in_stock',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const formatHeroSlide = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    title: row.title,
    subtitle: row.subtitle || '',
    tagline: row.tagline || '',
    image: row.image,
    mobileImage: row.mobile_image || '',
    ctaPrimaryText: row.cta_primary_text || '',
    ctaPrimaryLink: row.cta_primary_link || '',
    ctaSecondaryText: row.cta_secondary_text || '',
    ctaSecondaryLink: row.cta_secondary_link || '',
    order: row.order_index,
    isActive: row.is_active,
    createdAt: row.created_at
  };
};

export const formatInstagramPost = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    caption: row.caption || '',
    mediaUrl: row.media_url,
    permalink: row.permalink || '',
    likeCount: row.like_count || 0,
    order: row.order_index,
    isActive: row.is_active,
    createdAt: row.created_at
  };
};

export const formatOrder = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    orderNumber: row.order_number,
    customer: typeof row.customer === 'string' ? JSON.parse(row.customer) : row.customer,
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    subtotal: parseFloat(row.subtotal),
    shippingFee: parseFloat(row.shipping_fee),
    discountAmount: parseFloat(row.discount_amount || '0'),
    couponCode: row.coupon_code || '',
    total: parseFloat(row.total),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    trackingNumber: row.tracking_number || '',
    trackingCarrier: row.tracking_carrier || '',
    notes: row.notes || '',
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

export const formatWholesaleEnquiry = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    country: row.country,
    businessType: row.business_type,
    taxId: row.tax_id || '',
    taxOffice: row.tax_office || '',
    instagramHandle: row.instagram_handle || '',
    website: row.website || '',
    estimatedVolume: row.estimated_volume || '',
    message: row.message || '',
    status: row.status,
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at
  };
};

export const formatSiteSettings = (row) => {
  if (!row) return null;
  return {
    _id: String(row.id),
    brandName: row.brand_name || 'NEHİR ÇANTA',
    tagline: row.tagline || '',
    logo: row.logo || '',
    favicon: row.favicon || '',
    phone: row.phone || '',
    whatsAppNumber: row.whatsapp_number || '',
    email: row.email || '',
    address: row.address || '',
    openingHours: row.opening_hours || '',
    instagramUrl: row.instagram_url || '',
    currency: typeof row.currency === 'string' ? JSON.parse(row.currency) : (row.currency || { code: 'TRY', symbol: '₺' }),
    shippingSettings: typeof row.shipping_settings === 'string' ? JSON.parse(row.shipping_settings) : row.shipping_settings,
    paymentMethods: typeof row.payment_methods === 'string' ? JSON.parse(row.payment_methods) : row.payment_methods,
    bankAccounts: typeof row.bank_accounts === 'string' ? JSON.parse(row.bank_accounts) : (row.bank_accounts || []),
    announcementBar: typeof row.announcement_bar === 'string' ? JSON.parse(row.announcement_bar) : row.announcement_bar,
    trustBadges: typeof row.trust_badges === 'string' ? JSON.parse(row.trust_badges) : (row.trust_badges || {}),
    legalPolicies: typeof row.legal_policies === 'string' ? JSON.parse(row.legal_policies) : (row.legal_policies || {}),
    updatedAt: row.updated_at
  };
};
