import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slayt başlığı zorunludur.'],
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: 'YENİ SEZON KOLEKSİYONU'
  },
  image: {
    type: String,
    required: [true, 'Görsel URL zorunludur.']
  },
  mobileImage: {
    type: String,
    default: ''
  },
  ctaPrimaryText: {
    type: String,
    default: 'KOLEKSİYONU KEŞFET'
  },
  ctaPrimaryLink: {
    type: String,
    default: '/shop'
  },
  ctaSecondaryText: {
    type: String,
    default: 'YENİ GELENLER'
  },
  ctaSecondaryLink: {
    type: String,
    default: '/yeni-gelenler'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
export default HeroSlide;
