import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';
import { Category, Collection } from '../../types';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const { openCart, totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          api.get('/categories'),
          api.get('/collections')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (colRes.data.success) setCollections(colRes.data.collections);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNavData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border ${
          isScrolled ? 'py-3 shadow-sm' : 'py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-brand-primary hover:text-brand-taupe transition-colors"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-primary hover:text-brand-taupe transition-colors"
              aria-label="Arama"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="text-center lg:text-left flex-1 lg:flex-initial">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-luxury uppercase font-bold text-brand-primary group-hover:text-brand-charcoal transition-colors">
                {settings.brandName || 'NEHİR ÇANTA'}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-brand-taupe -mt-1 font-medium">
                İSTANBUL • 2016
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-luxury text-brand-primary">
            <Link to="/yeni-gelenler" className="hover:text-brand-gold transition-colors py-2">
              Yeni Gelenler
            </Link>

            {/* Bags Dropdown */}
            <div className="relative group">
              <Link
                to="/shop"
                className="flex items-center gap-1 hover:text-brand-gold transition-colors py-2"
              >
                Çantalar
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              <div className="absolute top-full -left-4 w-64 bg-brand-bg border border-brand-border shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/shop"
                  className="block px-5 py-2 text-xs hover:bg-brand-cream/60 transition-colors font-bold text-brand-primary border-b border-brand-border/60 mb-1"
                >
                  Tüm Çantaları Gör
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/kategori/${cat.slug}`}
                    className="block px-5 py-2 text-xs font-normal text-brand-charcoal hover:bg-brand-cream/60 hover:text-brand-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collections Dropdown */}
            <div className="relative group">
              <Link
                to="/koleksiyonlar"
                className="flex items-center gap-1 hover:text-brand-gold transition-colors py-2"
              >
                Koleksiyonlar
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              <div className="absolute top-full -left-4 w-64 bg-brand-bg border border-brand-border shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {collections.map((col) => (
                  <Link
                    key={col._id}
                    to={`/koleksiyon/${col.slug}`}
                    className="block px-5 py-2 text-xs font-normal text-brand-charcoal hover:bg-brand-cream/60 hover:text-brand-primary transition-colors"
                  >
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/indirim" className="text-brand-primary hover:text-brand-gold transition-colors py-2">
              Kampanyalar
            </Link>
            <Link to="/toptan" className="hover:text-brand-gold transition-colors py-2">
              Toptan Satış
            </Link>
            <Link to="/hakkimizda" className="hover:text-brand-gold transition-colors py-2">
              Hakkımızda
            </Link>
            <Link to="/iletisim" className="hover:text-brand-gold transition-colors py-2">
              İletişim
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Desktop Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-1 text-xs text-brand-primary hover:text-brand-gold transition-colors p-1"
              aria-label="Arama"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/favoriler"
              className="relative text-brand-primary hover:text-brand-gold transition-colors p-1"
              aria-label="Favoriler"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-brand-gold text-brand-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-brand-primary hover:text-brand-gold transition-colors p-1"
              aria-label="Sepet"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-brand-primary text-brand-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-brand-primary/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-brand-bg w-full max-w-2xl p-6 md:p-8 rounded-sm shadow-2xl border border-brand-border relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-primary hover:text-brand-taupe transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="text-xs uppercase tracking-luxury text-brand-taupe font-semibold block mb-3">
              Çanta ve Model Ara
            </span>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Örn: Omuz çantası, baget, kroko..."
                className="w-full bg-transparent border-b-2 border-brand-primary py-3 pr-10 text-lg md:text-xl font-medium focus:outline-none placeholder:text-brand-taupe/60"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 top-3 text-brand-primary hover:text-brand-gold transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="text-brand-taupe font-medium self-center">Popüler:</span>
              {['Kapitone Omuz Çantası', 'Baget Çanta', 'Tote Çanta', 'Mini Çapraz'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/shop?search=${encodeURIComponent(term)}`);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 bg-brand-cream hover:bg-brand-border text-brand-primary rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        collections={collections}
      />
    </>
  );
};
