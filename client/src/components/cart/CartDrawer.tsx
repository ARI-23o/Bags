import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTRY } from '../../utils/currency';
import { getCartWhatsAppLink } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
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

  if (!isOpen) return null;

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

  const freeShippingThreshold = settings.shippingSettings?.freeShippingThreshold || 1000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-brand-bg h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-brand-border z-10">
        {/* Header */}
        <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <h3 className="font-serif text-2xl font-bold uppercase tracking-luxury text-brand-primary">
              Sepetim ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-brand-primary hover:text-brand-taupe transition-colors"
            aria-label="Sepeti kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {settings.shippingSettings?.isFreeShippingEnabled && items.length > 0 && (
          <div className="bg-brand-cream/60 px-5 py-3 border-b border-brand-border text-xs">
            {isFreeShipping ? (
              <p className="font-semibold text-emerald-800 text-center">
                🎉 Tebrikler! Siparişiniz için Kargo Bedava!
              </p>
            ) : (
              <div>
                <p className="text-brand-charcoal text-center mb-1.5">
                  Ücretsiz kargo için sepetinize{' '}
                  <span className="font-bold text-brand-primary">
                    {formatTRY(freeShippingRemaining)}
                  </span>{' '}
                  değerinde daha ürün ekleyin.
                </p>
                <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-brand-taupe/40 mb-4" />
              <h4 className="font-serif text-2xl font-bold text-brand-primary mb-2">
                Sepetiniz Boş
              </h4>
              <p className="text-xs text-brand-taupe max-w-xs mb-6">
                Henüz sepetinize ürün eklemediniz. Yeni sezon çanta koleksiyonumuzu keşfetmeye hemen başlayın.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="luxury-btn-primary"
              >
                Koleksiyonu Keşfet
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const itemImage =
                item.selectedColor?.image ||
                item.product.primaryImage ||
                '/placeholder-bag.jpg';

              return (
                <div
                  key={`${item.product._id}-${item.selectedColor?.name || 'default'}-${index}`}
                  className="flex gap-4 pb-4 border-b border-brand-border/60"
                >
                  <img
                    src={itemImage}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded-sm border border-brand-border flex-shrink-0 bg-brand-cream"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/urun/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-brand-primary hover:text-brand-gold transition-colors line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.product._id, item.selectedColor?.name)
                          }
                          className="text-brand-taupe hover:text-red-500 transition-colors p-0.5"
                          title="Ürünü sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedColor && (
                        <span className="text-[11px] text-brand-taupe block mt-0.5">
                          Renk: {item.selectedColor.name}
                        </span>
                      )}

                      <span className="text-xs font-bold text-brand-primary block mt-1">
                        {formatTRY(item.product.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
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
                          className="px-2 py-0.5 text-xs text-brand-primary hover:bg-brand-cream"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.selectedColor?.name,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-0.5 text-xs text-brand-primary hover:bg-brand-cream"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-xs font-semibold text-brand-primary">
                        {formatTRY(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-brand-border bg-brand-cream/20 space-y-4">
            {/* Coupon Code Input */}
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

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-brand-charcoal pt-1">
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
                  <span>İndirim</span>
                  <span>-{formatTRY(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-brand-primary pt-2 border-t border-brand-border">
                <span>Genel Toplam</span>
                <span>{formatTRY(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  closeCart();
                  navigate('/odeme');
                }}
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
        )}
      </div>
    </div>
  );
};
