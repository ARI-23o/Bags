import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  color: {
    name: { type: String, default: '' },
    hexCode: { type: String, default: '' }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  customer: {
    firstName: { type: String, required: [true, 'Ad zorunludur.'], trim: true },
    lastName: { type: String, required: [true, 'Soyad zorunludur.'], trim: true },
    email: { type: String, required: [true, 'E-posta zorunludur.'], trim: true, lowercase: true },
    phone: { type: String, required: [true, 'Telefon numarası zorunludur.'], trim: true }
  },
  shippingAddress: {
    address: { type: String, required: [true, 'Adres zorunludur.'] },
    city: { type: String, required: [true, 'İl zorunludur.'] },        // e.g., "İstanbul"
    district: { type: String, required: [true, 'İlçe zorunludur.'] },  // e.g., "Kadıköy"
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Türkiye' }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['havale_eft', 'kapida_odeme', 'online_kredi_karti', 'whatsapp_direct'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  trackingCarrier: {
    type: String,
    default: 'Yurtiçi Kargo'
  },
  notes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
