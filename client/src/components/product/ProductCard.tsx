import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product, ColorVariant } from '../../types';
import { formatTRY } from '../../utils/currency';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isFavorited = isInWishlist(product._id);

  const displayImage =
    selectedColor?.image || product.primaryImage || '/placeholder-bag.jpg';
  const hoverImage = product.secondaryImage || displayImage;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <>
      <div className="group relative flex flex-col bg-transparent">
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream/60 rounded-sm border border-brand-border/40">
          <Link to={`/urun/${product.slug}`} className="block w-full h-full">
            <img
              src={displayImage}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.secondaryImage && (
              <img
                src={hoverImage}
                alt={`${product.title} alternatif`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="bg-brand-primary text-brand-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
                Tükendi
              </span>
            ) : (
              <>
                {product.isNewArrival && (
                  <span className="bg-brand-white/95 text-brand-primary text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                    Yeni
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="bg-brand-gold text-brand-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                    %{product.discountPercentage} İndirim
                  </span>
                )}
                {isLowStock && (
                  <span className="bg-amber-700 text-brand-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                    Son {product.stock} Ürün
                  </span>
                )}
              </>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-brand-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-sm z-10 ${
              isFavorited
                ? 'text-red-500 hover:text-red-600'
                : 'text-brand-primary hover:text-brand-gold hover:scale-110'
            }`}
            aria-label="Favorilere ekle"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Action Buttons on Desktop Hover */}
          <div className="absolute bottom-0 inset-x-0 p-3 hidden md:flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 bg-brand-white/95 hover:bg-brand-white text-brand-primary text-[11px] font-semibold uppercase tracking-wider py-2 px-3 rounded-sm shadow-md transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              Hızlı Bakış
            </button>
            {!isOutOfStock && (
              <button
                onClick={() => addToCart(product, selectedColor, 1)}
                className="bg-brand-primary hover:bg-brand-charcoal text-brand-white p-2 rounded-sm shadow-md transition-colors"
                aria-label="Sepete Ekle"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="pt-3 pb-1 flex flex-col flex-grow">
          {/* Category */}
          {product.category && (
            <span className="text-[10px] uppercase tracking-luxury text-brand-taupe mb-1">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <Link
            to={`/urun/${product.slug}`}
            className="text-sm font-medium text-brand-primary hover:text-brand-gold transition-colors line-clamp-1 mb-1.5"
          >
            {product.title}
          </Link>

          {/* Colors Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor?.name === color.name
                      ? 'ring-1 ring-brand-primary ring-offset-1 scale-110'
                      : 'border-brand-border/60 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hexCode || '#000000' }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
              <span className="text-[11px] text-brand-taupe ml-1">
                {product.colors.length} Renk
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-sm md:text-base font-semibold text-brand-primary">
              {formatTRY(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-brand-taupe line-through font-normal">
                {formatTRY(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};
