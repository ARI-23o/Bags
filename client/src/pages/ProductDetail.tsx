import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronDown,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2
} from 'lucide-react';
import api from '../services/api';
import { Product, ColorVariant } from '../types';
import { formatTRY } from '../utils/currency';
import { getProductWhatsAppLink } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected state
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/products/${slug}`);
        if (response.data.success && response.data.product) {
          const prod: Product = response.data.product;
          setProduct(prod);
          setRelatedProducts(response.data.related || []);

          if (prod.colors && prod.colors.length > 0) {
            setSelectedColor(prod.colors[0]);
          }

          setSelectedImage(prod.primaryImage || (prod.images && prod.images[0]) || '');
        } else {
          setError('Ürün bulunamadı.');
        }
      } catch (err: any) {
        setError(err.message || 'Ürün yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-brand-cream rounded-sm" />
          <div className="space-y-4">
            <div className="h-6 bg-brand-cream w-1/4 rounded" />
            <div className="h-10 bg-brand-cream w-3/4 rounded" />
            <div className="h-8 bg-brand-cream w-1/3 rounded" />
            <div className="h-40 bg-brand-cream rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-brand-primary mb-3">
          Ürün Bulunamadı
        </h2>
        <p className="text-sm text-brand-taupe mb-6">
          {error || 'Aradığınız ürün mevcut değil veya kaldırılmış olabilir.'}
        </p>
        <Link to="/shop" className="luxury-btn-primary">
          Çanta Koleksiyonuna Dön
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, quantity);
    navigate('/odeme');
  };

  const whatsappLink = getProductWhatsAppLink(
    product,
    selectedColor?.name,
    settings.whatsAppNumber
  );

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  // Product JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.title,
    'image': [product.primaryImage, ...(product.images || [])],
    'description': product.shortDescription || product.description,
    'sku': product.sku,
    'offers': {
      '@type': 'Offer',
      'url': typeof window !== 'undefined' ? window.location.href : '',
      'priceCurrency': 'TRY',
      'price': product.price,
      'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <>
      <SEOHelmet
        title={product.title}
        description={product.shortDescription || product.description}
        ogImage={product.primaryImage}
        ogType="product"
        schema={productSchema}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-brand-cream/40 border-b border-brand-border py-3 text-xs text-brand-taupe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-primary transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-primary transition-colors">
            Çantalar
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/kategori/${product.category.slug}`}
                className="hover:text-brand-primary transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brand-primary font-medium truncate max-w-xs">
            {product.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream rounded-sm border border-brand-border">
              <img
                src={selectedImage || product.primaryImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.isNewArrival && (
                  <span className="bg-brand-white text-brand-primary text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-sm shadow-sm">
                    Yeni
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="bg-brand-gold text-brand-white text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-sm shadow-sm">
                    %{product.discountPercentage} İndirim
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all bg-brand-cream ${
                      selectedImage === img
                        ? 'border-brand-primary scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} görsel ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Purchase Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs uppercase tracking-luxury text-brand-taupe mb-2">
                <span>{product.category?.name || 'Kadın Çanta'}</span>
                <span>ÜRÜN KODU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-brand-primary">
                  {formatTRY(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-base text-brand-taupe line-through font-normal">
                    {formatTRY(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Feedback */}
            <div className="py-2 border-y border-brand-border/60">
              {isOutOfStock ? (
                <span className="inline-block bg-brand-primary text-brand-white text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                  Tükendi (Stokta Yok)
                </span>
              ) : isLowStock ? (
                <span className="inline-block bg-amber-700 text-brand-white text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                  Son {product.stock} Ürün Kaldı!
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Stokta Mevcut • Hızlı Teslimat
                </span>
              )}
            </div>

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-luxury text-brand-primary mb-2.5">
                  Renk:{' '}
                  <span className="font-normal text-brand-taupe">
                    {selectedColor?.name || 'Seçiniz'}
                  </span>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        if (color.image) setSelectedImage(color.image);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.name === color.name
                          ? 'border-brand-primary scale-110 shadow-sm'
                          : 'border-brand-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hexCode || '#000000' }}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm text-brand-charcoal leading-relaxed font-light">
                {product.shortDescription}
              </p>
            )}

            {/* Quantity and Actions */}
            {!isOutOfStock && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-brand-primary rounded-sm h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 text-brand-primary hover:bg-brand-cream h-full transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-4 text-brand-primary hover:bg-brand-cream h-full transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="flex-1 luxury-btn-primary h-12 text-sm"
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400" />
                        Sepete Eklendi
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Sepete Ekle
                      </>
                    )}
                  </button>

                  {/* Wishlist Icon */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 border border-brand-border rounded-sm flex items-center justify-center transition-colors ${
                      isFavorited
                        ? 'text-red-500 border-red-300 bg-red-50'
                        : 'text-brand-primary hover:bg-brand-cream'
                    }`}
                    aria-label="Favorilere Ekle"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full luxury-btn-outline h-12 text-sm font-semibold"
                >
                  Hemen Al (Doğrudan Ödeme)
                </button>
              </div>
            )}

            {/* WhatsApp Inquiry Button */}
            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full luxury-btn-whatsapp h-12 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp'tan Bilgi Al & Sipariş Ver
              </a>
              <span className="block text-[11px] text-center text-brand-taupe mt-1.5">
                Model, stok veya toptan bilgi için anında WhatsApp temsilcimize ulaşın.
              </span>
            </div>

            {/* Accordions */}
            <div className="pt-6 border-t border-brand-border space-y-3">
              {/* Product Specifications */}
              <div className="border border-brand-border rounded-sm overflow-hidden">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-luxury text-brand-primary bg-brand-cream/30 hover:bg-brand-cream/50 transition-colors"
                >
                  <span>Ürün Özellikleri & Ölçüler</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'details' && (
                  <div className="p-4 text-xs text-brand-charcoal space-y-2 bg-brand-bg">
                    {product.description && (
                      <p className="mb-3 leading-relaxed">{product.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border/60">
                      <div>
                        <span className="font-semibold text-brand-primary block">Materyal:</span>
                        <span>{product.material || 'Premium Vegan Deri'}</span>
                      </div>
                      {product.dimensions && (
                        <div>
                          <span className="font-semibold text-brand-primary block">Ölçüler:</span>
                          <span>
                            {product.dimensions.width && `En: ${product.dimensions.width} `}
                            {product.dimensions.height && `Boy: ${product.dimensions.height} `}
                            {product.dimensions.depth && `Derinlik: ${product.dimensions.depth}`}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-brand-primary block">Askı Türü:</span>
                        <span>{product.strapType || 'Ayarlanabilir Askı'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-brand-primary block">Kapanış:</span>
                        <span>{product.closure || 'Fermuarlı'}</span>
                      </div>
                    </div>
                    {product.careInstructions && (
                      <p className="text-[11px] text-brand-taupe pt-2">
                        💡 <span className="font-medium">Bakım:</span> {product.careInstructions}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Accordion */}
              <div className="border border-brand-border rounded-sm overflow-hidden">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-luxury text-brand-primary bg-brand-cream/30 hover:bg-brand-cream/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-gold" />
                    Kargo ve Teslimat
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="p-4 text-xs text-brand-charcoal space-y-2 bg-brand-bg leading-relaxed">
                    <p>
                      Siparişleriniz ortalama <strong>{settings.shippingSettings?.estimatedDeliveryDays || '2 - 4 iş günü'}</strong> içerisinde güvenle hazırlanarak kargo firmasına teslim edilir.
                    </p>
                    <p>
                      <strong>1000 TL ve üzeri</strong> tüm siparişlerinizde kargo ücretsizdir. Kargo takip numaranız siparişiniz yola çıktığında SMS ve e-posta ile iletilir.
                    </p>
                  </div>
                )}
              </div>

              {/* Returns Accordion */}
              <div className="border border-brand-border rounded-sm overflow-hidden">
                <button
                  onClick={() => toggleAccordion('returns')}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-luxury text-brand-primary bg-brand-cream/30 hover:bg-brand-cream/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-brand-gold" />
                    İade ve Değişim
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'returns' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'returns' && (
                  <div className="p-4 text-xs text-brand-charcoal space-y-2 bg-brand-bg leading-relaxed">
                    <p>
                      Siparişinizi teslim aldığınız tarihten itibaren <strong>14 gün</strong> içerisinde kullanılmamış ve orijinal koruyucu ambalajı bozulmamış ürünler için iade ve değişim talebinde bulunabilirsiniz.
                    </p>
                    <p>
                      İade ve değişim sürecinizi başlatmak için WhatsApp destek hattımız ile iletişime geçebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-brand-border">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
                SEÇKİN TAVSİYELER
              </span>
              <h3 className="font-serif text-3xl font-bold text-brand-primary">
                Benzer Modeller
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
