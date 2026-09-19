import { query } from '../config/db.js';
import { formatSiteSettings } from '../utils/dbHelpers.js';

const defaultSettingsData = {
  brandName: 'NEHİR ÇANTA',
  tagline: 'Zarafetin ve Tarzın Buluşma Noktası',
  phone: '+90 532 000 00 00',
  whatsAppNumber: '905320000000',
  email: 'info@nehircanta.com',
  address: 'Nişantaşı, Teşvikiye Cad. No:42, Şişli / İstanbul',
  openingHours: 'Pazartesi - Cumartesi: 09:30 - 19:30',
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
    accountHolder: 'Nehir Çanta Tic. Ltd. Şti.',
    iban: 'TR12 0001 0000 1234 5678 9012 34',
    branchCode: 'Kadıköy Şubesi'
  }],
  announcementBar: {
    isEnabled: true,
    text: 'Yeni Sezon Kadın Çanta Koleksiyonumuz Yayında! 1000 TL Üzeri Siparişlerde Kargo Bedava.',
    link: '/shop'
  },
  trustBadges: {
    badge1Title: 'Özenli Paketleme',
    badge1Subtitle: 'Her çanta özel koruyucu kılıfı ile özenle paketlenir.',
    badge2Title: 'Güvenli Ödeme',
    badge2Subtitle: 'Banka Havalesi / EFT ve Kapıda Ödeme imkanı.',
    badge3Title: 'Hızlı İletişim',
    badge3Subtitle: 'WhatsApp destek hattımızdan anında bilgi alabilirsiniz.',
    badge4Title: 'Kalite Güvencesi',
    badge4Subtitle: 'Kusursuz dikiş ve seçkin malzeme kalitesi.'
  }
};

export const getPublicSettings = async (req, res, next) => {
  try {
    let result = await query('SELECT * FROM site_settings LIMIT 1');

    if (result.rows.length === 0) {
      const insertRes = await query(
        `INSERT INTO site_settings (
          brand_name, tagline, phone, whatsapp_number, email, address, opening_hours,
          instagram_url, currency, shipping_settings, payment_methods, bank_accounts,
          announcement_bar, trust_badges
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          defaultSettingsData.brandName,
          defaultSettingsData.tagline,
          defaultSettingsData.phone,
          defaultSettingsData.whatsAppNumber,
          defaultSettingsData.email,
          defaultSettingsData.address,
          defaultSettingsData.openingHours,
          defaultSettingsData.instagramUrl,
          JSON.stringify(defaultSettingsData.currency),
          JSON.stringify(defaultSettingsData.shippingSettings),
          JSON.stringify(defaultSettingsData.paymentMethods),
          JSON.stringify(defaultSettingsData.bankAccounts),
          JSON.stringify(defaultSettingsData.announcementBar),
          JSON.stringify(defaultSettingsData.trustBadges)
        ]
      );
      return res.json({ success: true, settings: formatSiteSettings(insertRes.rows[0]) });
    }

    res.json({ success: true, settings: formatSiteSettings(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const getSettings = getPublicSettings;

export const updateAdminSettings = async (req, res, next) => {
  try {
    const data = req.body;
    let existing = await query('SELECT id FROM site_settings LIMIT 1');

    let result;
    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO site_settings (
          brand_name, tagline, logo, favicon, phone, whatsapp_number, email, address, opening_hours,
          instagram_url, currency, shipping_settings, payment_methods, bank_accounts,
          announcement_bar, trust_badges, legal_policies
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          data.brandName,
          data.tagline,
          data.logo,
          data.favicon,
          data.phone,
          data.whatsAppNumber,
          data.email,
          data.address,
          data.openingHours,
          data.instagramUrl,
          JSON.stringify(data.currency || defaultSettingsData.currency),
          JSON.stringify(data.shippingSettings || defaultSettingsData.shippingSettings),
          JSON.stringify(data.paymentMethods || defaultSettingsData.paymentMethods),
          JSON.stringify(data.bankAccounts || []),
          JSON.stringify(data.announcementBar || defaultSettingsData.announcementBar),
          JSON.stringify(data.trustBadges || defaultSettingsData.trustBadges),
          JSON.stringify(data.legalPolicies || {})
        ]
      );
    } else {
      const id = existing.rows[0].id;
      result = await query(
        `UPDATE site_settings
         SET brand_name = COALESCE($1, brand_name),
             tagline = COALESCE($2, tagline),
             logo = COALESCE($3, logo),
             favicon = COALESCE($4, favicon),
             phone = COALESCE($5, phone),
             whatsapp_number = COALESCE($6, whatsapp_number),
             email = COALESCE($7, email),
             address = COALESCE($8, address),
             opening_hours = COALESCE($9, opening_hours),
             instagram_url = COALESCE($10, instagram_url),
             currency = COALESCE($11, currency),
             shipping_settings = COALESCE($12, shipping_settings),
             payment_methods = COALESCE($13, payment_methods),
             bank_accounts = COALESCE($14, bank_accounts),
             announcement_bar = COALESCE($15, announcement_bar),
             trust_badges = COALESCE($16, trust_badges),
             legal_policies = COALESCE($17, legal_policies),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $18
         RETURNING *`,
        [
          data.brandName,
          data.tagline,
          data.logo,
          data.favicon,
          data.phone,
          data.whatsAppNumber,
          data.email,
          data.address,
          data.openingHours,
          data.instagramUrl,
          data.currency ? JSON.stringify(data.currency) : null,
          data.shippingSettings ? JSON.stringify(data.shippingSettings) : null,
          data.paymentMethods ? JSON.stringify(data.paymentMethods) : null,
          data.bankAccounts ? JSON.stringify(data.bankAccounts) : null,
          data.announcementBar ? JSON.stringify(data.announcementBar) : null,
          data.trustBadges ? JSON.stringify(data.trustBadges) : null,
          data.legalPolicies ? JSON.stringify(data.legalPolicies) : null,
          id
        ]
      );
    }

    res.json({ success: true, settings: formatSiteSettings(result.rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = updateAdminSettings;
