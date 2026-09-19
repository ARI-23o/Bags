import React, { useState } from 'react';
import { Building2, CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';
import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  validateTaxId
} from '../utils/validators';

export const WholesalePage: React.FC = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Türkiye',
    businessType: 'Fiziksel Butik / Mağaza',
    taxId: '',
    taxOffice: '',
    instagramHandle: '',
    website: '',
    estimatedVolume: '25-50 Adet / Ay',
    message: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    switch (name) {
      case 'companyName':
        if (!value || value.trim().length < 2) errorMsg = 'Firma / Butik adı en az 2 karakter olmalıdır.';
        break;
      case 'contactName': {
        const res = validateName(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz yetkili adı.';
        break;
      }
      case 'email': {
        const res = validateEmail(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz e-posta.';
        break;
      }
      case 'phone': {
        const res = validatePhone(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz telefon.';
        break;
      }
      case 'city':
        if (!value || value.trim().length < 2) errorMsg = 'Şehir alanı zorunludur.';
        break;
      case 'taxId': {
        const res = validateTaxId(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz Vergi No / TCKN.';
        break;
      }
      case 'message':
        if (!value || value.trim().length < 10) errorMsg = 'Mesajınız en az 10 karakter olmalıdır.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === '';
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, (formData as any)[field] || '');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let cleanValue = value;

    if (name === 'phone') {
      cleanValue = formatPhoneNumber(value);
    } else if (name === 'taxId') {
      cleanValue = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'contactName') {
      cleanValue = value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    if (touched[name]) {
      validateField(name, cleanValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const fieldsToValidate = ['companyName', 'contactName', 'email', 'phone', 'city', 'taxId', 'message'];
    const newTouched: Record<string, boolean> = {};
    fieldsToValidate.forEach((f) => { newTouched[f] = true; });
    setTouched(newTouched);

    let isValid = true;
    fieldsToValidate.forEach((f) => {
      const valid = validateField(f, (formData as any)[f] || '');
      if (!valid) isValid = false;
    });

    if (!isValid) {
      setGeneralError('Lütfen formdaki eksik veya hatalı alanları düzeltiniz.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/wholesale', formData);
      if (response.data.success) {
        setSubmitted(true);
      } else {
        setGeneralError(response.data.message || 'Başvuru gönderilemedi.');
      }
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || err.message || 'Başvuru gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet
        title="Toptan Çanta Satışı & B2B Başvuru | Nehir Çanta"
        description="Butiğiniz ve işletmeniz için toptan kadın çanta modelleri. Özel fiyat teklifleri ve toptan sipariş süreci hakkında bilgi alın."
      />

      {/* Header Banner */}
      <div className="bg-brand-primary text-brand-white py-16 md:py-24 border-b border-brand-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-brand-gold font-semibold">
            B2B & İŞ ORTAKLIĞI
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Toptan Satış & Butik Ortaklığı
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Fiziksel butikler, online e-ticaret siteleri ve perakende mağazaları için Nehir Çanta'nın seçkin kadın çanta koleksiyonunu işletmenize taşıyın.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Benefits & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
                AVANTAJLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                Neden Nehir Çanta ile Çalışmalısınız?
              </h2>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary mb-1">
                    Yüksek Kar Marjı & Trend Modeller
                  </h3>
                  <p className="text-brand-taupe leading-relaxed">
                    Instagram ve perakendede en çok satan güncel modellerle butiğinizin satışlarını katlayın.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary mb-1">
                    Kusursuz Kalite Kontrol
                  </h3>
                  <p className="text-brand-taupe leading-relaxed">
                    Tüm çantalar atölyemizden çıkmadan önce detaylı kalite kontrol testlerinden geçer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary mb-1">
                    Birebir Toptan Müşteri Temsilcisi
                  </h3>
                  <p className="text-brand-taupe leading-relaxed">
                    Sipariş ve model seçimlerinizde WhatsApp üzerinden hızlı destek sunan özel temsilciniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp B2B */}
            <div className="p-6 bg-brand-cream/40 border border-brand-border rounded-sm space-y-3">
              <h4 className="font-serif text-lg font-bold text-brand-primary">
                Hızlı Toptan Bilgi Almak İster misiniz?
              </h4>
              <p className="text-xs text-brand-taupe leading-relaxed">
                Toptan satış kataloğumuz ve fiyat listemiz hakkında WhatsApp üzerinden anında bilgi alabilirsiniz.
              </p>
              <a
                href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=Merhaba%20Nehir%20Çanta,%20toptan%20satış%20ve%20katalog%20hakkında%20bilgi%20almak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full luxury-btn-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp'tan Toptan Bilgi Al
              </a>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-3xl font-bold text-brand-primary">
                  Başvurunuz Alındı!
                </h3>
                <p className="text-xs sm:text-sm text-brand-taupe max-w-md mx-auto">
                  Toptan satış ekibimiz başvurunuzu inceledikten sonra en kısa sürede sizinle iletişime geçecektir.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="luxury-btn-outline mt-4"
                >
                  Yeni Bir Başvuru Yap
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
                    BAŞVURU FORMU
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                    Toptan Satış Ön Başvurusu
                  </h3>
                </div>

                {generalError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Firma / Butik Adı *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('companyName')}
                      placeholder="Örn: Butik Bella"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.companyName && errors.companyName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.companyName && errors.companyName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Yetkili Adı Soyadı *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('contactName')}
                      placeholder="Adınız Soyadınız"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.contactName && errors.contactName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.contactName && errors.contactName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.contactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      E-Posta Adresi *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="ornek@butik.com"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.email && errors.email
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={14}
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="05XX XXX XX XX"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.phone && errors.phone
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Şehir *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      placeholder="Örn: İstanbul, Ankara, İzmir..."
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.city && errors.city
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.city && errors.city && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      İşletme Türü
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary cursor-pointer"
                    >
                      <option value="Fiziksel Butik / Mağaza">Fiziksel Butik / Mağaza</option>
                      <option value="Online E-Ticaret Sitesi">Online E-Ticaret Sitesi</option>
                      <option value="Instagram / Sosyal Medya Satıcısı">Instagram / Sosyal Medya Satıcısı</option>
                      <option value="Pazaryeri Satıcısı (Trendyol, Hepsiburada vb.)">Pazaryeri Satıcısı (Trendyol, Hepsiburada vb.)</option>
                      <option value="Yeni Başlayan / Girişimci">Yeni Başlayan / Girişimci</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Vergi No / T.C. Kimlik No
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      maxLength={11}
                      value={formData.taxId}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('taxId')}
                      placeholder="10 veya 11 Haneli No"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.taxId && errors.taxId
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.taxId && errors.taxId && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.taxId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Aylık Tahmini Alım Adedi
                    </label>
                    <select
                      name="estimatedVolume"
                      value={formData.estimatedVolume}
                      onChange={handleInputChange}
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary cursor-pointer"
                    >
                      <option value="25-50 Adet / Ay">25 - 50 Adet / Ay</option>
                      <option value="50-100 Adet / Ay">50 - 100 Adet / Ay</option>
                      <option value="100-250 Adet / Ay">100 - 250 Adet / Ay</option>
                      <option value="250+ Adet / Ay">250+ Adet / Ay</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Instagram Sayfanız (Varsa)
                    </label>
                    <input
                      type="text"
                      name="instagramHandle"
                      value={formData.instagramHandle}
                      onChange={handleInputChange}
                      placeholder="@butikadi"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Web Siteniz (Varsa)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.butik.com"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Mesajınız / Talep Detaylarınız *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('message')}
                    placeholder="İlgilendiğiniz çanta modelleri ve detaylı sorularınızı buraya yazabilirsiniz..."
                    className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                      touched.message && errors.message
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full luxury-btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Başvurunuz İletiliyor...' : 'Toptan Satış Başvurusunu Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
