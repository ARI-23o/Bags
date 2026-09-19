import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Building, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatTRY } from '../utils/currency';
import api from '../services/api';
import { SEOHelmet } from '../components/common/SEOHelmet';

// Turkish Cities list
const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın',
  'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı',
  'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
  'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars',
  'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa',
  'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
  'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingFee, discountAmount, appliedCoupon, total, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'İstanbul',
    district: '',
    address: '',
    postalCode: '',
    paymentMethod: 'havale_eft',
    notes: '',
    agreeTerms: true,
    agreeKvkk: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.district.trim() ||
      !formData.address.trim()
    ) {
      setError('Lütfen tüm zorunlu teslimat ve iletişim alanlarını doldurunuz.');
      return;
    }

    if (!formData.agreeTerms || !formData.agreeKvkk) {
      setError('Lütfen sözleşme ve aydınlatma metnini onaylayınız.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim()
        },
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city,
          district: formData.district.trim(),
          postalCode: formData.postalCode.trim(),
          country: 'Türkiye'
        },
        items: items.map((item) => ({
          productId: item.product._id,
          title: item.product.title,
          sku: item.product.sku,
          color: item.selectedColor ? { name: item.selectedColor.name, hexCode: item.selectedColor.hexCode } : undefined,
          quantity: item.quantity,
          image: item.selectedColor?.image || item.product.primaryImage
        })),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await api.post('/orders', orderPayload);

      if (response.data.success && response.data.order) {
        clearCart();
        navigate('/siparis-basarili', { state: { order: response.data.order } });
      } else {
        setError(response.data.message || 'Sipariş oluşturulamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet title="Sipariş ve Güvenli Ödeme | Nehir Çanta" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          Güvenli Ödeme & Sipariş
        </h1>
        <p className="text-xs sm:text-sm text-brand-taupe mb-8">
          Teslimat bilgilerinizi giriniz ve ödeme yönteminizi seçiniz.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer & Address Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-brand-bg border border-brand-border p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-brand-primary border-b border-brand-border pb-3">
                1. İletişim Bilgileri
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Soyadınız *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
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
                    placeholder="ornek@mail.com"
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
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-brand-bg border border-brand-border p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-brand-primary border-b border-brand-border pb-3">
                2. Teslimat Adresi
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    İl *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    {TURKISH_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Örn: Kadıköy"
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Açık Adres (Mahalle, Cadde, Sokak, No, Daire) *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Kargonuzun hatasız teslim edilebilmesi için açık adresinizi yazınız."
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Posta Kodu (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="34710"
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Sipariş Notu (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Kuryeye iletmek istediğiniz not"
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-brand-bg border border-brand-border p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-brand-primary border-b border-brand-border pb-3">
                3. Ödeme Yöntemi
              </h2>

              <div className="space-y-3">
                {/* Havale / EFT Option */}
                {settings.paymentMethods?.havaleEftEnabled && (
                  <label
                    className={`block p-4 border rounded-sm cursor-pointer transition-colors ${
                      formData.paymentMethod === 'havale_eft'
                        ? 'border-brand-primary bg-brand-cream/40 ring-1 ring-brand-primary'
                        : 'border-brand-border hover:bg-brand-cream/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="havale_eft"
                        checked={formData.paymentMethod === 'havale_eft'}
                        onChange={handleInputChange}
                        className="accent-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <Building className="w-5 h-5 text-brand-gold" />
                      <div>
                        <span className="font-bold text-xs uppercase tracking-luxury text-brand-primary block">
                          Banka Havalesi / EFT ile Ödeme
                        </span>
                        <span className="text-[11px] text-brand-taupe">
                          Siparişinizi oluşturduktan sonra banka hesap bilgilerimize havale/EFT yapabilirsiniz.
                        </span>
                      </div>
                    </div>

                    {formData.paymentMethod === 'havale_eft' && settings.bankAccounts && settings.bankAccounts.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-brand-border/60 text-xs bg-brand-bg p-3 rounded space-y-1.5 text-brand-charcoal">
                        <p className="font-bold text-brand-primary">Banka Hesap Bilgimiz:</p>
                        <p>Banka: {settings.bankAccounts[0].bankName}</p>
                        <p>Alıcı: {settings.bankAccounts[0].accountHolder}</p>
                        <p className="font-mono text-xs font-bold text-brand-primary">
                          IBAN: {settings.bankAccounts[0].iban}
                        </p>
                      </div>
                    )}
                  </label>
                )}

                {/* Kapıda Ödeme Option */}
                {settings.paymentMethods?.kapidaOdemeEnabled && (
                  <label
                    className={`block p-4 border rounded-sm cursor-pointer transition-colors ${
                      formData.paymentMethod === 'kapida_odeme'
                        ? 'border-brand-primary bg-brand-cream/40 ring-1 ring-brand-primary'
                        : 'border-brand-border hover:bg-brand-cream/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="kapida_odeme"
                        checked={formData.paymentMethod === 'kapida_odeme'}
                        onChange={handleInputChange}
                        className="accent-brand-primary w-4 h-4 cursor-pointer"
                      />
                      <Truck className="w-5 h-5 text-brand-gold" />
                      <div>
                        <span className="font-bold text-xs uppercase tracking-luxury text-brand-primary block">
                          Kapıda Ödeme (Nakit / Kredi Kartı)
                        </span>
                        <span className="text-[11px] text-brand-taupe">
                          Kargonuz teslim edilirken kuryeye nakit veya kart ile ödeme yapabilirsiniz.
                        </span>
                      </div>
                    </div>
                  </label>
                )}

                {/* Online Credit Card (Configurable) */}
                <div className="p-4 border border-brand-border/60 bg-brand-cream/10 rounded-sm opacity-60">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-brand-taupe" />
                    <div>
                      <span className="font-bold text-xs uppercase tracking-luxury text-brand-taupe block">
                        Online Kredi Kartı / Taksit
                      </span>
                      <span className="text-[11px] text-brand-taupe">
                        {settings.paymentMethods?.creditCardEnabled
                          ? 'Sanal POS aktif'
                          : 'Online POS entegrasyonu henüz aktif değil. Lütfen Havale/EFT veya Kapıda Ödeme seçiniz.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Checkboxes */}
            <div className="space-y-3 p-4 bg-brand-cream/20 border border-brand-border text-xs text-brand-charcoal rounded-sm">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 accent-brand-primary w-4 h-4 cursor-pointer"
                  required
                />
                <span>
                  <Link
                    to="/mesafeli-satis-sozlesmesi"
                    target="_blank"
                    className="underline text-brand-primary font-medium"
                  >
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  'ni ve Ön Bilgilendirme Formu'nu okudum, onaylıyorum. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeKvkk"
                  checked={formData.agreeKvkk}
                  onChange={handleInputChange}
                  className="mt-0.5 accent-brand-primary w-4 h-4 cursor-pointer"
                  required
                />
                <span>
                  Kişisel verilerimin işlenmesine ilişkin{' '}
                  <Link
                    to="/kvkk-aydinlatma-metni"
                    target="_blank"
                    className="underline text-brand-primary font-medium"
                  >
                    KVKK Aydınlatma Metni
                  </Link>
                  'ni okudum. *
                </span>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-brand-cream/30 border border-brand-border p-6 rounded-sm space-y-6 sticky top-28">
              <h3 className="font-serif text-2xl font-bold uppercase tracking-luxury text-brand-primary border-b border-brand-border pb-3">
                Siparişiniz ({items.length} Ürün)
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const img = item.selectedColor?.image || item.product.primaryImage || '/placeholder-bag.jpg';
                  return (
                    <div key={idx} className="flex gap-3 text-xs">
                      <img
                        src={img}
                        alt={item.product.title}
                        className="w-14 h-16 object-cover rounded-sm border border-brand-border bg-brand-cream flex-shrink-0"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-brand-primary block line-clamp-1">
                          {item.product.title}
                        </span>
                        {item.selectedColor && (
                          <span className="text-brand-taupe block text-[11px]">
                            Renk: {item.selectedColor.name}
                          </span>
                        )}
                        <span className="text-brand-taupe block text-[11px]">
                          Adet: {item.quantity}
                        </span>
                        <span className="font-bold text-brand-primary block mt-0.5">
                          {formatTRY(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-brand-charcoal pt-3 border-t border-brand-border">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-semibold">{formatTRY(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700">Ücretsiz</span>
                    ) : (
                      formatTRY(shippingFee)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>İndirim Tutarı</span>
                    <span>-{formatTRY(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-brand-primary pt-3 border-t border-brand-border">
                  <span>Ödenecek Tutar</span>
                  <span>{formatTRY(total)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full luxury-btn-primary py-4 text-sm"
              >
                {loading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla & Tamamla'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-brand-taupe pt-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>256-Bit SSL Güvenli Alışveriş ve Gizlilik Koruması</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
