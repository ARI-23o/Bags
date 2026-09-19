import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatTRY } from '../utils/currency';
import api from '../services/api';
import { SEOHelmet } from '../components/common/SEOHelmet';
import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  validateAddress,
  validateDistrict,
  validatePostalCode
} from '../utils/validators';

// Turkish Cities list (81 provinces)
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

  // Validation Error States
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Validate a specific field
  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    switch (name) {
      case 'firstName': {
        const res = validateName(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz ad.';
        break;
      }
      case 'lastName': {
        const res = validateName(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz soyad.';
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
      case 'district': {
        const res = validateDistrict(value);
        if (!res.isValid) errorMsg = res.error || 'İlçe zorunludur.';
        break;
      }
      case 'address': {
        const res = validateAddress(value);
        if (!res.isValid) errorMsg = res.error || 'Detaylı adres zorunludur.';
        break;
      }
      case 'postalCode': {
        const res = validatePostalCode(value);
        if (!res.isValid) errorMsg = res.error || 'Geçersiz posta kodu.';
        break;
      }
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
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    let cleanValue = value;

    // Apply specific input formatting / type constraints
    if (name === 'phone') {
      cleanValue = formatPhoneNumber(value);
    } else if (name === 'postalCode') {
      cleanValue = value.replace(/\D/g, '').slice(0, 5);
    } else if (name === 'firstName' || name === 'lastName') {
      // Filter out numbers and special characters from names
      cleanValue = value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    if (touched[name]) {
      validateField(name, cleanValue);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'district', 'address', 'postalCode'];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((f) => { newTouched[f] = true; });
    setTouched(newTouched);

    // Validate all fields
    let isValid = true;
    allFields.forEach((field) => {
      const valid = validateField(field, (formData as any)[field] || '');
      if (!valid) isValid = false;
    });

    if (!isValid) {
      setGeneralError('Lütfen formdaki hatalı veya eksik alanları düzeltiniz.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.agreeTerms || !formData.agreeKvkk) {
      setGeneralError('Lütfen Mesafeli Satış Sözleşmesi ve KVKK Aydınlatma Metnini onaylayınız.');
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
          image: item.selectedColor?.image || item.product.primaryImage,
          price: item.product.price,
          totalPrice: item.product.price * item.quantity
        })),
        subtotal,
        shippingFee,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await api.post('/orders', orderPayload);

      if (response.data.success && response.data.order) {
        clearCart();
        navigate('/siparis-basarili', { state: { order: response.data.order } });
      } else {
        setGeneralError(response.data.message || 'Sipariş oluşturulamadı.');
      }
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || err.message || 'Sipariş oluşturulurken bir hata oluştu.');
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

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
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
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Örn: Ayşe"
                    className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                      touched.firstName && errors.firstName
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.firstName}
                    </p>
                  )}
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
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Örn: Yılmaz"
                    className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                      touched.lastName && errors.lastName
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.lastName}
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
                    onBlur={() => handleBlur('district')}
                    placeholder="Örn: Kadıköy / Nişantaşı"
                    className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                      touched.district && errors.district
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {touched.district && errors.district && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.district}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                  Açık Adres (Mahalle, Cadde, Sokak, Bina No, Daire) *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('address')}
                  placeholder="Örn: Teşvikiye Mah. Valikonağı Cad. No: 42 Daire: 5"
                  className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                    touched.address && errors.address
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-brand-border focus:border-brand-primary'
                  }`}
                />
                {touched.address && errors.address && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Posta Kodu (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('postalCode')}
                    placeholder="34365"
                    className={`w-full bg-brand-bg border p-3 text-xs rounded-sm focus:outline-none transition-colors ${
                      touched.postalCode && errors.postalCode
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-brand-border focus:border-brand-primary'
                    }`}
                  />
                  {touched.postalCode && errors.postalCode && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.postalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                    Sipariş Notu (İsteğe Bağlı)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    maxLength={200}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Örn: Hediye paketi yapılmasını rica ederim"
                    className="w-full bg-brand-bg border border-brand-border p-3 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-brand-bg border border-brand-border p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-brand-primary border-b border-brand-border pb-3">
                3. Ödeme Yöntemi
              </h2>

              <div className="space-y-3">
                {settings.paymentMethods.havaleEftEnabled && (
                  <label
                    className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                      formData.paymentMethod === 'havale_eft'
                        ? 'border-brand-primary bg-brand-cream/30'
                        : 'border-brand-border hover:bg-brand-cream/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="havale_eft"
                      checked={formData.paymentMethod === 'havale_eft'}
                      onChange={handleInputChange}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-primary">
                          Banka Havalesi / EFT ile Ödeme
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-taupe mt-1">
                        Siparişinizi tamamladıktan sonra banka IBAN hesabımıza transfer yapabilirsiniz.
                      </p>

                      {formData.paymentMethod === 'havale_eft' && settings.bankAccounts && settings.bankAccounts.length > 0 && (
                        <div className="mt-3 p-3 bg-brand-bg border border-brand-border rounded-sm space-y-2">
                          <p className="text-[11px] font-semibold text-brand-primary">Banka Hesap Bilgilerimiz:</p>
                          {settings.bankAccounts.map((acc, i) => (
                            <div key={i} className="text-[11px] text-brand-taupe">
                              <p className="font-medium text-brand-primary">{acc.bankName} - {acc.accountHolder}</p>
                              <p className="font-mono text-brand-primary select-all">{acc.iban}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                )}

                {settings.paymentMethods.kapidaOdemeEnabled && (
                  <label
                    className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                      formData.paymentMethod === 'kapida_odeme'
                        ? 'border-brand-primary bg-brand-cream/30'
                        : 'border-brand-border hover:bg-brand-cream/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kapida_odeme"
                      checked={formData.paymentMethod === 'kapida_odeme'}
                      onChange={handleInputChange}
                      className="mt-1 text-brand-primary focus:ring-brand-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-primary">
                          Kapıda Nakit veya Kartla Ödeme
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-taupe mt-1">
                        Kargonuz teslim edilirken kargo görevlisine nakit veya kredi kartı ile ödeme yapabilirsiniz.
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Legal Agreements */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-[11px] text-brand-taupe leading-relaxed">
                  <Link to="/mesafeli-satis-sozlesmesi" target="_blank" className="underline text-brand-primary">
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  'ni ve Ön Bilgilendirme Formu'nu okudum, onaylıyorum. *
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeKvkk"
                  checked={formData.agreeKvkk}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-[11px] text-brand-taupe leading-relaxed">
                  Kişisel verilerimin{' '}
                  <Link to="/kvkk" target="_blank" className="underline text-brand-primary">
                    KVKK Aydınlatma Metni
                  </Link>{' '}
                  kapsamında işlenmesini onaylıyorum. *
                </span>
              </label>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-brand-cream/40 border border-brand-border p-6 rounded-sm sticky top-24 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-brand-primary border-b border-brand-border pb-3">
                Sipariş Özeti ({items.length} Ürün)
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.selectedColor?.name}`} className="flex gap-4 items-center">
                    <img
                      src={item.selectedColor?.image || item.product.primaryImage}
                      alt={item.product.title}
                      className="w-16 h-20 object-cover rounded-sm border border-brand-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-primary truncate">{item.product.title}</h4>
                      {item.selectedColor && (
                        <p className="text-[11px] text-brand-taupe mt-0.5">Renk: {item.selectedColor.name}</p>
                      )}
                      <p className="text-[11px] text-brand-taupe">Adet: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-brand-primary whitespace-nowrap">
                      {formatTRY(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t border-brand-border pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-brand-taupe">
                  <span>Ara Toplam:</span>
                  <span>{formatTRY(subtotal)}</span>
                </div>

                <div className="flex justify-between text-brand-taupe">
                  <span>Kargo Ücreti:</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-700 font-semibold">ÜCRETSİZ</span> : formatTRY(shippingFee)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Kupon İndirimi ({appliedCoupon?.code}):</span>
                    <span>-{formatTRY(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-brand-primary pt-3 border-t border-brand-border">
                  <span>Toplam Tutar:</span>
                  <span>{formatTRY(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-brand-bg py-4 text-xs uppercase tracking-luxury font-bold rounded-sm hover:bg-brand-primary/90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Siparişiniz Oluşturuluyor...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    <span>Siparişi Onayla & Tamamla ({formatTRY(total)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-brand-taupe pt-2 border-t border-brand-border">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL ile %100 Güvenli Alışveriş</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
