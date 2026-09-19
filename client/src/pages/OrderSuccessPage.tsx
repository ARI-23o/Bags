import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';
import { formatTRY } from '../utils/currency';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-brand-primary mb-3">
          Sipariş Bilgisi Bulunamadı
        </h2>
        <p className="text-sm text-brand-taupe mb-6">
          Sipariş takibi için lütfen sipariş takip sayfamızı kullanınız.
        </p>
        <Link to="/" className="luxury-btn-primary">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappMsg = `Merhaba Nehir Çanta, ${order.orderNumber} numaralı siparişim ile ilgili bilgi almak istiyorum. Toplam Tutar: ${formatTRY(order.total)}`;
  const whatsappUrl = `https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <>
      <SEOHelmet title={`Sipariş Alındı: ${order.orderNumber} | Nehir Çanta`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Success Card */}
        <div className="bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-brand-border">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block">
              SİPARİŞİNİZ BAŞARIYLA ALINDI
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">
              Teşekkür Ederiz, {order.customer.firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-taupe max-w-md mx-auto">
              Sipariş detaylarınız ve bilgilendirme e-postası <strong>{order.customer.email}</strong> adresine iletilmiştir.
            </p>
          </div>

          {/* Order Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-cream/40 rounded-sm text-xs">
            <div>
              <span className="text-brand-taupe block">Sipariş No:</span>
              <span className="font-bold text-brand-primary text-sm">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-brand-taupe block">Tarih:</span>
              <span className="font-semibold text-brand-primary">
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <div>
              <span className="text-brand-taupe block">Ödeme Yöntemi:</span>
              <span className="font-semibold text-brand-primary uppercase">
                {order.paymentMethod === 'havale_eft'
                  ? 'Havale / EFT'
                  : order.paymentMethod === 'kapida_odeme'
                  ? 'Kapıda Ödeme'
                  : 'Kredi Kartı'}
              </span>
            </div>
            <div>
              <span className="text-brand-taupe block">Toplam Tutar:</span>
              <span className="font-bold text-brand-primary text-sm">
                {formatTRY(order.total)}
              </span>
            </div>
          </div>

          {/* Bank Transfer Notice if applicable */}
          {order.paymentMethod === 'havale_eft' && settings.bankAccounts && settings.bankAccounts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-xs text-amber-900 space-y-2">
              <p className="font-bold">⚠️ Havale / EFT Bilgilendirmesi:</p>
              <p>
                Lütfen sipariş tutarını <strong>24 saat</strong> içerisinde aşağıdaki banka hesabımıza gönderiniz. Açıklama kısmına <strong>{order.orderNumber}</strong> sipariş numaranızı yazmayı unutmayınız.
              </p>
              <div className="pt-1 font-mono text-xs bg-white/70 p-2.5 rounded border border-amber-200">
                <p><strong>Banka:</strong> {settings.bankAccounts[0].bankName}</p>
                <p><strong>Alıcı:</strong> {settings.bankAccounts[0].accountHolder}</p>
                <p><strong>IBAN:</strong> {settings.bankAccounts[0].iban}</p>
              </div>
            </div>
          )}

          {/* Ordered Items List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
              Sipariş Edilen Ürünler
            </h3>
            <div className="border border-brand-border rounded-sm divide-y divide-brand-border/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-14 object-cover rounded-sm bg-brand-cream border border-brand-border"
                      />
                    )}
                    <div>
                      <span className="font-semibold text-brand-primary block">{item.title}</span>
                      {item.color?.name && (
                        <span className="text-brand-taupe text-[11px] block">
                          Renk: {item.color.name}
                        </span>
                      )}
                      <span className="text-brand-taupe text-[11px]">
                        {item.quantity} Adet × {formatTRY(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-brand-primary">
                    {formatTRY(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-4 bg-brand-cream/20 border border-brand-border rounded-sm text-xs space-y-1">
            <h4 className="font-bold uppercase tracking-luxury text-brand-primary mb-2">
              Teslimat Adresi
            </h4>
            <p className="font-medium text-brand-primary">
              {order.customer.firstName} {order.customer.lastName} ({order.customer.phone})
            </p>
            <p className="text-brand-charcoal">{order.shippingAddress.address}</p>
            <p className="text-brand-charcoal">
              {order.shippingAddress.district} / {order.shippingAddress.city}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-border">
            <Link to="/shop" className="flex-1 luxury-btn-primary text-center">
              Alışverişe Devam Et <ShoppingBag className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn-whatsapp text-center"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Sipariş Bildirimi
            </a>

            <button
              onClick={handlePrint}
              className="px-4 py-3 border border-brand-border text-xs uppercase tracking-wider text-brand-primary hover:bg-brand-cream transition-colors rounded-sm flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Yazdır
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
