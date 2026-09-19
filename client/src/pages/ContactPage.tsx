import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';
import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhoneNumber
} from '../utils/validators';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      case 'name': {
        const res = validateName(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz ad soyad.';
        break;
      }
      case 'email': {
        const res = validateEmail(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz e-posta.';
        break;
      }
      case 'phone': {
        if (value && value.trim()) {
          const res = validatePhone(value);
          if (!res.isValid) errorMsg = res.error || 'Geçersiz telefon.';
        }
        break;
      }
      case 'subject':
        if (!value || value.trim().length < 3) errorMsg = 'Konu en az 3 karakter olmalıdır.';
        break;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let cleanValue = value;

    if (name === 'phone') {
      cleanValue = formatPhoneNumber(value);
    } else if (name === 'name') {
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

    const fieldsToValidate = ['name', 'email', 'phone', 'subject', 'message'];
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
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setGeneralError(response.data.message || 'Mesaj gönderilemedi.');
      }
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || err.message || 'Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet
        title="İletişim & Mağaza Bilgileri | Nehir Çanta"
        description="Nehir Çanta iletişim kanalları, mağaza adresi, telefon, e-posta ve WhatsApp destek hattı."
      />

      <div className="bg-brand-cream/50 py-14 md:py-20 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-gold font-semibold block">
            BİZE ULAŞIN
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-primary">
            İletişim & Destek
          </h1>
          <p className="text-sm text-brand-taupe max-w-lg mx-auto">
            Ürünlerimiz, siparişleriniz veya toptan satış hakkında sorularınız için dilediğiniz zaman bize ulaşabilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-primary mb-4">
                Mağaza & Müşteri Hizmetleri
              </h2>
              <p className="text-xs text-brand-charcoal leading-relaxed">
                Haftanın 6 günü çalışma saatlerimiz içerisinde WhatsApp destek hattımızdan ve telefon numaramızdan anında yanıt alabilirsiniz.
              </p>
            </div>

            <div className="space-y-6 text-xs text-brand-charcoal">
              <div className="flex items-start gap-4 p-4 bg-brand-cream/30 border border-brand-border rounded-sm">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block text-sm mb-1">
                    Adresimiz
                  </span>
                  <p className="text-brand-taupe">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-brand-cream/30 border border-brand-border rounded-sm">
                <Phone className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block text-sm mb-1">
                    Telefon & WhatsApp
                  </span>
                  <p className="text-brand-taupe">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-brand-cream/30 border border-brand-border rounded-sm">
                <Mail className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block text-sm mb-1">
                    E-Posta
                  </span>
                  <p className="text-brand-taupe">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-brand-cream/30 border border-brand-border rounded-sm">
                <Clock className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block text-sm mb-1">
                    Çalışma Saatleri
                  </span>
                  <p className="text-brand-taupe">{settings.openingHours}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=Merhaba%20Nehir%20Çanta`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full luxury-btn-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Destek Hattı
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-10 shadow-sm">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mb-2">
              Bize Mesaj Gönderin
            </h3>
            <p className="text-xs text-brand-taupe mb-6">
              Formu doldurarak bize ileteceğiniz mesajlara en geç 24 saat içerisinde dönüş yapılmaktadır.
            </p>

            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-2xl font-bold text-brand-primary">
                  Mesajınız İletildi!
                </h4>
                <p className="text-xs text-brand-taupe">
                  Müşteri temsilcimiz en kısa sürede e-posta veya telefon üzerinden sizinle iletişime geçecektir.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="luxury-btn-outline mt-3"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {generalError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('name')}
                      placeholder="Ad Soyad"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.name && errors.name
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
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
                      placeholder="ornek@mail.com"
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
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      name="phone"
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
                      Konu *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('subject')}
                      placeholder="Örn: Sipariş / Ürün Bilgisi"
                      className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                        touched.subject && errors.subject
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-brand-border focus:border-brand-primary'
                      }`}
                    />
                    {touched.subject && errors.subject && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('message')}
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
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
                  {loading ? 'Mesajınız Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
