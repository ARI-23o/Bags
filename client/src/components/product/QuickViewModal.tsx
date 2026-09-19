import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, MessageCircle, Check, ArrowRight } from 'lucide-react';
import { Product, ColorVariant } from '../../types';
import { formatTRY } from '../../utils/currency';
import { getProductWhatsAppLink } from '../../utils/whatsapp';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.primaryImage || (product.images && product.images[0]) || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const whatsappLink = getProductWhatsAppLink(
    product,
    selectedColor?.name,
    settings.whatsAppNumber
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-primary/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-brand-bg w-full max-w-3xl rounded-sm shadow-2xl border border-brand-border z-10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-brand-primary hover:text-brand-taupe transition-colors bg-brand-bg/80 backdrop-blur-sm rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-brand-cream/30">
          <div className="aspect-[3/4] w-full overflow-hidden bg-brand-cream rounded-sm mb-3">
            <img
              src={selectedImage || product.primaryImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img ? 'border-brand-primary' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="küçük görsel" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs uppercase tracking-luxury text-brand-taupe mb-2">
              <span>{product.category?.name || 'Çanta'}</span>
              <span>KOD: {product.sku}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-primary mb-3">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-bold text-brand-primary">
                {formatTRY(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-brand-taupe line-through">
                  {formatTRY(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="inline-block bg-brand-primary text-brand-white text-xs px-2.5 py-1 uppercase font-semibold tracking-wider">
                  Tükendi
                </span>
              ) : isLowStock ? (
                <span className="inline-block bg-amber-700 text-brand-white text-xs px-2.5 py-1 uppercase font-semibold tracking-wider">
                  Son {product.stock} Adet Kaldı
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Stokta Mevcut
                </span>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-2">
                  Renk:{' '}
                  <span className="font-normal text-brand-taupe">
                    {selectedColor?.name || 'Seçiniz'}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c);
                        if (c.image) setSelectedImage(c.image);
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name
                          ? 'border-brand-primary scale-110 shadow-sm'
                          : 'border-brand-border/80 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hexCode || '#000000' }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-luxury text-brand-primary">
                  Adet:
                </span>
                <div className="flex items-center border border-brand-border rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-brand-primary hover:bg-brand-cream transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-brand-primary hover:bg-brand-cream transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-brand-border">
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full luxury-btn-primary"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Sepete Ekle
                  </>
                )}
              </button>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full luxury-btn-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp'tan Bilgi Al
            </a>

            <div className="text-center pt-2">
              <Link
                to={`/urun/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs uppercase tracking-luxury font-semibold text-brand-primary hover:text-brand-gold transition-colors"
              >
                Tüm Detayları Gör <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
