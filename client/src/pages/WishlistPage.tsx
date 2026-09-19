import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <>
      <SEOHelmet title="Favori Ürünlerim | Nehir Çanta" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
            BEĞENDİKLERİNİZ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            Favori Çantalarım
          </h1>
          <p className="text-xs sm:text-sm text-brand-taupe mt-2">
            {wishlistCount > 0
              ? `Favorilerinizde ${wishlistCount} adet çanta bulunuyor.`
              : 'Henüz favorilerinize bir ürün eklemediniz.'}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream/30 border border-brand-border rounded-sm max-w-xl mx-auto">
            <Heart className="w-16 h-16 text-brand-taupe/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
              Henüz Favori Ürününüz Bulunmuyor
            </h3>
            <p className="text-xs text-brand-taupe max-w-xs mx-auto mb-6">
              Beğendiğiniz çantalardaki kalp ikonuna tıklayarak favorilerinize ekleyebilir ve daha sonra kolayca ulaşabilirsiniz.
            </p>
            <Link to="/shop" className="luxury-btn-primary">
              Koleksiyonu Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
