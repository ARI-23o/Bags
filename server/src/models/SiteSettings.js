import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  bankName: { type: String, default: 'Ziraat Bankası' },
  accountHolder: { type: String, default: 'Nehir Çanta' },
  iban: { type: String, default: 'TR00 0000 0000 0000 0000 0000 00' },
  branchCode: { type: String, default: '' },
  accountNumber: { type: String, default: '' }
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  brandName: {
    type: String,
    default: 'NEHİR ÇANTA'
  },
  tagline: {
    type: String,
    default: 'Zarafetin ve Tarzın Buluşma Noktası'
  },
  logo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: '+90 500 000 00 00'
  },
  whatsAppNumber: {
    type: String,
    default: '905000000000'
  },
  email: {
    type: String,
    default: 'info@nehircanta.com'
  },
  address: {
    type: String,
    default: 'İstanbul, Türkiye'
  },
  openingHours: {
    type: String,
    default: 'Pazartesi - Cumartesi: 09:00 - 19:00'
  },
  instagramUrl: {
    type: String,
    default: 'https://www.instagram.com/nehircanta2016/'
  },
  currency: {
    code: { type: String, default: 'TRY' },
    symbol: { type: String, default: '₺' }
  },
  shippingSettings: {
    standardRate: { type: Number, default: 79.90 },
    freeShippingThreshold: { type: Number, default: 1000 },
    isFreeShippingEnabled: { type: Boolean, default: true },
    estimatedDeliveryDays: { type: String, default: '2 - 4 İş Günü' }
  },
  paymentMethods: {
    havaleEftEnabled: { type: Boolean, default: true },
    kapidaOdemeEnabled: { type: Boolean, default: true },
    kapidaOdemeFee: { type: Number, default: 29.90 },
    creditCardEnabled: { type: Boolean, default: false } // Only active when payment gateway is configured
  },
  bankAccounts: [bankAccountSchema],
  announcementBar: {
    isEnabled: { type: Boolean, default: true },
    text: { type: String, default: 'Yeni Sezon Çanta Koleksiyonumuz Yayında! 1000 TL Üzeri Ücretsiz Kargo.' },
    link: { type: String, default: '/shop' }
  },
  trustBadges: {
    badge1Title: { type: String, default: 'Özenli Paketleme' },
    badge1Subtitle: { type: String, default: 'Her çanta özel koruyucu kılıfı ile paketlenir.' },
    badge2Title: { type: String, default: 'Güvenli Ödeme' },
    badge2Subtitle: { type: String, default: 'Havale/EFT ve kapıda ödeme seçenekleri.' },
    badge3Title: { type: String, default: 'Hızlı İletişim' },
    badge3Subtitle: { type: String, default: 'WhatsApp hattımızdan anında destek.' },
    badge4Title: { type: String, default: 'Kalite Güvencesi' },
    badge4Subtitle: { type: String, default: 'Seçkin malzemeler ve titiz işçilik.' }
  },
  legalPolicies: {
    mesafeliSatis: { type: String, default: '' },
    gizlilik: { type: String, default: '' },
    iade: { type: String, default: '' },
    kvkk: { type: String, default: '' }
  },
  seoDefaults: {
    metaTitle: { type: String, default: 'Nehir Çanta | Kadın Çanta & Aksesuar Koleksiyonu' },
    metaDescription: { type: String, default: 'Nehir Çanta - Yeni sezon kadın omuz çantası, çapraz çanta, el çantası ve trend modelleri keşfedin. Kaliteli ve şık tasarımlar.' },
    keywords: { type: [String], default: ['nehir çanta', 'kadın çanta', 'omuz çantası', 'çapraz çanta', 'el çantası', 'moda çanta'] }
  }
}, {
  timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
