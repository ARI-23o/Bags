import mongoose from 'mongoose';

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Siyah", "Taba", "Bej"
  hexCode: { type: String, default: '#000000' },
  stock: { type: Number, default: 0, min: 0 },
  image: { type: String, default: '' }
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ürün adı zorunludur.'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU / Ürün kodu zorunludur.'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori seçilmelidir.'],
    index: true
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Satış fiyatı zorunludur.'],
    min: 0
  },
  comparePrice: {
    type: Number,
    default: null,
    min: 0
  },
  costPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  images: {
    type: [String],
    default: []
  },
  primaryImage: {
    type: String,
    default: ''
  },
  secondaryImage: {
    type: String,
    default: ''
  },
  colors: [colorVariantSchema],
  shortDescription: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: 'Suni Deri / Vegan Leather'
  },
  dimensions: {
    width: { type: String, default: '' },   // e.g. "28 cm"
    height: { type: String, default: '' },  // e.g. "18 cm"
    depth: { type: String, default: '' }    // e.g. "8 cm"
  },
  strapType: {
    type: String,
    default: 'Ayarlanabilir Deri & Zincir Askı'
  },
  closure: {
    type: String,
    default: 'Fermuarlı ve Mıknatıslı Kapak'
  },
  interiorDetails: {
    type: String,
    default: 'Astar kaplı ana bölme ve fermuarlı iç cep'
  },
  careInstructions: {
    type: String,
    default: 'Nemli bir bezle silinmesi önerilir. Direkt güneş ışığından ve kimyasal temizleyicilerden uzak tutunuz.'
  },
  tags: {
    type: [String],
    default: []
  },
  isNewArrival: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isSale: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active',
    index: true
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: [String], default: [] }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text index for full-text search across Turkish fields
productSchema.index({
  title: 'text',
  sku: 'text',
  shortDescription: 'text',
  description: 'text',
  material: 'text',
  tags: 'text'
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status text
productSchema.virtual('stockStatus').get(function () {
  if (this.stock <= 0) return 'out_of_stock';
  if (this.stock <= 3) return 'low_stock';
  return 'in_stock';
});

const Product = mongoose.model('Product', productSchema);
export default Product;
