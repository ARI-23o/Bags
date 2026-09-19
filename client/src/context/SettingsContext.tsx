import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { SiteSettings } from '../types';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
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

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data.success && response.data.settings) {
        setSettings({ ...defaultSettings, ...response.data.settings });
      }
    } catch (error) {
      console.warn('[SettingsContext] API settings fetch error, using defaults.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
