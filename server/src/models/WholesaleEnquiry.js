import mongoose from 'mongoose';

const wholesaleEnquirySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Firma adı zorunludur.'],
    trim: true
  },
  contactName: {
    type: String,
    required: [true, 'Yetkili kişi adı zorunludur.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur.'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası zorunludur.'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Şehir bilgisi zorunludur.'],
    trim: true
  },
  country: {
    type: String,
    default: 'Türkiye'
  },
  businessType: {
    type: String,
    enum: ['Fiziksel Butik / Mağaza', 'Online Satıcı / E-Ticaret', 'Sosyal Medya Satıcısı', 'Zincir Mağaza', 'Diğer'],
    default: 'Fiziksel Butik / Mağaza'
  },
  taxId: {
    type: String,
    default: ''
  },
  taxOffice: {
    type: String,
    default: ''
  },
  instagramHandle: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  estimatedVolume: {
    type: String,
    default: '25-50 Adet / Ay'
  },
  message: {
    type: String,
    required: [true, 'Mesajınız zorunludur.'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const WholesaleEnquiry = mongoose.model('WholesaleEnquiry', wholesaleEnquirySchema);
export default WholesaleEnquiry;
