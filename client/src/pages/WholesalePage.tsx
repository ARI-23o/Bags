import React, { useState } from 'react';
import { Building2, CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';

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

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.companyName.trim() ||
      !formData.contactName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.message.trim()
    ) {
      setError('Lütfen zorunlu alanları (Firma, Yetkili, E-posta, Telefon, Şehir, Mesaj) doldurunuz.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/wholesale', formData);
      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.message || 'Başvuru gönderilemedi.');
      }
    } catch (err: any) {
      setError(err.message || 'Başvuru gönderilirken bir hata oluştu.');
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

            <div className="space-y-6 text-xs text-brand-charcoal">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary mb-1">
                    Sürekli Güncellenen Trend Modeller
                  </h3>
                  <p className="text-brand-taupe leading-relaxed">
                    Instagram ve sosyal medyada en çok aranan, hızlı satılan yeni sezon modelleri düzenli olarak mağazanıza sunuyoruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary mb-1">
                    Güvenilir Tedarik & Düzenli Stok
                  </h3>
                  <p className="text-brand-taupe leading-relaxed">
                    Siparişleriniz zamanında ve eksiksiz paketlenerek anlaşmalı kargo firmalarıyla adresinize ulaştırılır.
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

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm">
                    {error}
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
                      placeholder="Örn: Butik Bella"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
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
                      placeholder="Adınız Soyadınız"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
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
                      placeholder="ornek@butik.com"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0532 000 00 00"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
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
                      placeholder="Örn: İzmir"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
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
                      <option value="Online Satıcı / E-Ticaret">Online Satıcı / E-Ticaret</option>
                      <option value="Sosyal Medya Satıcısı">Sosyal Medya Satıcısı (Instagram vb.)</option>
                      <option value="Zincir Mağaza">Zincir Mağaza</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Instagram Hesabı
                    </label>
                    <input
                      type="text"
                      name="instagramHandle"
                      value={formData.instagramHandle}
                      onChange={handleInputChange}
                      placeholder="@butikhesabiniz"
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Tahmini Aylık Alım Hacmi
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

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                      Mesajınız & İlgilendiğiniz Modeller *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="İşletmeniz hakkında kısa bilgi ve ilgilendiğiniz çanta kategorilerini belirtebilirsiniz."
                      className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full luxury-btn-primary py-3.5 text-xs font-semibold mt-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Gönderiliyor...' : 'Toptan Başvuruyu Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
