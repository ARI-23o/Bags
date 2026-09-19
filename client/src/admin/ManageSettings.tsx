import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, ShieldCheck, Building, Truck, Bell } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const ManageSettings: React.FC = () => {
  const { settings: initialSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<any>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSettings) {
      setFormData(initialSettings);
    }
  }, [initialSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (parent: string, child: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleBankAccountChange = (index: number, field: string, value: string) => {
    const updated = [...(formData.bankAccounts || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, bankAccounts: updated }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put('/settings/admin', formData);
      if (response.data.success) {
        setSuccess(true);
        await refreshSettings();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || 'Ayarlar kaydedilemedi.');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Mağaza Ayarları</h1>
        <p className="text-xs text-slate-400 mt-1">
          WhatsApp numarası, kargo ücretleri, banka hesapları ve genel mağaza parametrelerini yönetin.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Tüm mağaza ayarları başarıyla kaydedildi!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* 1. General & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" /> Genel & İletişim Bilgileri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Marka Adı
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                WhatsApp Sipariş / Destek Numarası (Ülke kodu ile)
              </label>
              <input
                type="text"
                name="whatsAppNumber"
                value={formData.whatsAppNumber || ''}
                onChange={handleChange}
                placeholder="905320000000"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-amber-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Telefon Numarası
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                E-Posta Adresi
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Fiziksel Mağaza / İletişim Adresi
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Instagram Sayfası URL
              </label>
              <input
                type="text"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Çalışma Saatleri
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* 2. Announcement Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" /> Üst Duyuru Bandı (Announcement Bar)
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementBar?.isEnabled ?? true}
                onChange={(e) => handleNestedChange('announcementBar', 'isEnabled', e.target.checked)}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-200">Duyuru Bandını Göster</span>
            </label>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Duyuru Metni
              </label>
              <input
                type="text"
                value={formData.announcementBar?.text || ''}
                onChange={(e) => handleNestedChange('announcementBar', 'text', e.target.value)}
                placeholder="Yeni Sezon Kadın Çanta Koleksiyonumuz Yayında!"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* 3. Shipping Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" /> Kargo & Teslimat Ayarları
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Standart Kargo Bedeli (₺)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.shippingSettings?.standardRate ?? 79.9}
                onChange={(e) => handleNestedChange('shippingSettings', 'standardRate', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Ücretsiz Kargo Barajı (₺)
              </label>
              <input
                type="number"
                value={formData.shippingSettings?.freeShippingThreshold ?? 1000}
                onChange={(e) => handleNestedChange('shippingSettings', 'freeShippingThreshold', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Tahmini Teslimat Süresi
              </label>
              <input
                type="text"
                value={formData.shippingSettings?.estimatedDeliveryDays || '2 - 4 İş Günü'}
                onChange={(e) => handleNestedChange('shippingSettings', 'estimatedDeliveryDays', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Bank Accounts for EFT */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-white border-b border-slate-800 pb-3">
            Havale / EFT Banka Hesap Bilgisi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Banka Adı
              </label>
              <input
                type="text"
                value={formData.bankAccounts?.[0]?.bankName || ''}
                onChange={(e) => handleBankAccountChange(0, 'bankName', e.target.value)}
                placeholder="Ziraat Bankası"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Hesap Sahibi (Alıcı Adı)
              </label>
              <input
                type="text"
                value={formData.bankAccounts?.[0]?.accountHolder || ''}
                onChange={(e) => handleBankAccountChange(0, 'accountHolder', e.target.value)}
                placeholder="Nehir Çanta Tic. Ltd. Şti."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                IBAN Numarası
              </label>
              <input
                type="text"
                value={formData.bankAccounts?.[0]?.iban || ''}
                onChange={(e) => handleBankAccountChange(0, 'iban', e.target.value)}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded text-xs transition-colors inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};
