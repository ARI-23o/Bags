import SiteSettings from '../models/SiteSettings.js';
import { logAudit } from '../middleware/auditLogger.js';

// Helper to get or create default settings
export const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({
      brandName: 'NEHİR ÇANTA',
      tagline: 'Zarafetin ve Tarzın Buluşma Noktası',
      phone: '+90 500 000 00 00',
      whatsAppNumber: '905000000000',
      email: 'info@nehircanta.com',
      address: 'İstanbul, Türkiye',
      openingHours: 'Pazartesi - Cumartesi: 09:00 - 19:00',
      instagramUrl: 'https://www.instagram.com/nehircanta2016/',
      currency: { code: 'TRY', symbol: '₺' },
      shippingSettings: {
        standardRate: 79.90,
        freeShippingThreshold: 1000,
        isFreeShippingEnabled: true,
        estimatedDeliveryDays: '2 - 4 İş Günü'
      },
      paymentMethods: {
        havaleEftEnabled: true,
        kapidaOdemeEnabled: true,
        kapidaOdemeFee: 29.90,
        creditCardEnabled: false
      },
      bankAccounts: [{
        bankName: 'Ziraat Bankası',
        accountHolder: 'Nehir Çanta Tekstil Tic. Ltd. Şti.',
        iban: 'TR00 0000 0000 0000 0000 0000 00'
      }],
      announcementBar: {
        isEnabled: true,
        text: 'Yeni Sezon Kadın Çanta Koleksiyonumuz Yayında! 1000 TL Üzeri Ücretsiz Kargo.',
        link: '/shop'
      }
    });
  }
  return settings;
};

// @desc    Get public site settings
// @route   GET /api/settings
// @access  Public
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update site settings
// @route   PUT /api/settings/admin
// @access  Private (Admin)
export const updateAdminSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();
    await logAudit(req, 'UPDATE_SETTINGS', 'SiteSettings', settings._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Mağaza ayarları başarıyla güncellendi.',
      settings
    });
  } catch (error) {
    next(error);
  }
};
