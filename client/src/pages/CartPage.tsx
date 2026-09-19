import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, MessageCircle, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatTRY } from '../utils/currency';
import { getCartWhatsAppLink } from '../utils/whatsapp';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    isFreeShipping,
    freeShippingRemaining,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    totalItemsCount
  } = useCart();

  const { settings } = useSettings();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const whatsappCheckoutLink = getCartWhatsAppLink(
    items,
    subtotal,
    shippingFee,
    total,
    settings.whatsAppNumber
  );

  return (
    <>
      <SEOHelmet title="Alışveriş Sepeti | Nehir Çanta" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary mb-2">
          Alışveriş Sepetim
        </h1>
        <p className="text-xs sm:text-sm text-brand-taupe mb-8">
          Sepetinizde {totalItemsCount} ürün bulunmaktadır.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream/30 border border-brand-border rounded-sm">
            <ShoppingBag className="w-16 h-16 text-brand-taupe/40 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-brand-primary mb-2">
              Sepetiniz Boş
            </h2>
            <p className="text-xs text-brand-taupe max-w-sm mx-auto mb-6">
              Henüz sepetinize çanta eklemediniz. En yeni modellerimizi hemen keşfedin.
            </p>
            <Link to="/shop" className="luxury-btn-primary">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free shipping alert */}
              {settings.shippingSettings?.isFreeShippingEnabled && (
                <div className="bg-brand-cream/60 p-4 border border-brand-border rounded-sm text-xs">
                  {isFreeShipping ? (
                    <span className="font-semibold text-emerald-800">
                      🎉 Tebrikler! Bu siparişinizde kargo ücretsiz.
                    </span>
                  ) : (
                    <span>
                      Ücretsiz kargo için sepetinize{' '}
                      <strong className="text-brand-primary">
                        {formatTRY(freeShippingRemaining)}
                      </strong>{' '}
                      tutarında daha ürün ekleyin.
                    </span>
                  )}
                </div>
              )}

              {/* Items Table */}
              <div className="border border-brand-border rounded-sm overflow-hidden bg-brand-bg">
                {items.map((item, index) => {
                  const itemImage =
                    item.selectedColor?.image ||
                    item.product.primaryImage ||
                    '/placeholder-bag.jpg';

                  return (
                    <div
                      key={index}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 last:border-none"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={itemImage}
                          alt={item.product.title}
                          className="w-20 h-24 object-cover rounded-sm border border-brand-border bg-brand-cream flex-shrink-0"
                        />
                        <div>
                          <Link
                            to={`/urun/${item.product.slug}`}
                            className="text-sm font-semibold text-brand-primary hover:text-brand-gold transition-colors block"
                          >
                            {item.product.title}
                          </Link>
                          {item.selectedColor && (
                            <span className="text-xs text-brand-taupe block mt-0.5">
                              Renk: {item.selectedColor.name}
                            </span>
                          )}
                          <span className="text-xs font-bold text-brand-primary block mt-1">
                            {formatTRY(item.product.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-brand-border rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.selectedColor?.name,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-sm font-semibold hover:bg-brand-cream"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.selectedColor?.name,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-sm font-semibold hover:bg-brand-cream"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="text-sm font-bold text-brand-primary min-w-[5rem] text-right">
                          {formatTRY(item.product.price * item.quantity)}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeFromCart(item.product._id, item.selectedColor?.name)
                          }
                          className="text-brand-taupe hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-brand-cream/30 border border-brand-border rounded-sm p-6 space-y-6">
                <h3 className="font-serif text-2xl font-bold uppercase tracking-luxury text-brand-primary border-b border-brand-border pb-3">
                  Sipariş Özeti
                </h3>

                {/* Coupon Box */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-sm text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{appliedCoupon.code} (%{appliedCoupon.discountValue} İndirim)</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
                      >
                        Kaldır
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="İndirim Kuponu"
                        className="flex-1 bg-brand-bg border border-brand-border px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-brand-primary rounded-sm"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading}
                        className="px-4 py-2 bg-brand-primary text-brand-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-charcoal transition-colors rounded-sm"
                      >
                        {couponLoading ? '...' : 'Uygula'}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-2 text-xs text-brand-charcoal pt-2">
                  <div className="flex justify-between">
                    <span>Ara Toplam</span>
                    <span className="font-semibold">{formatTRY(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo Ücreti</span>
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
                  <div className="flex justify-between text-lg font-bold text-brand-primary pt-3 border-t border-brand-border">
                    <span>Genel Toplam</span>
                    <span>{formatTRY(total)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => navigate('/odeme')}
                    className="w-full luxury-btn-primary"
                  >
                    Ödemeye Geç <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={whatsappCheckoutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full luxury-btn-whatsapp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp'tan Sipariş Ver
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
