import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import api from '../services/api';
import { Product, Category, HeroSlide, InstagramPost } from '../types';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { EditorialBanner } from '../components/home/EditorialBanner';
import { TrustBadges } from '../components/home/TrustBadges';
import { InstagramGrid } from '../components/home/InstagramGrid';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const Home: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [slidesRes, catsRes, newRes, featRes, instaRes] = await Promise.all([
          api.get('/hero'),
          api.get('/categories'),
          api.get('/products?isNewArrival=true&limit=4'),
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/instagram')
        ]);

        if (slidesRes.data.success) setSlides(slidesRes.data.slides);
        if (catsRes.data.success) setCategories(catsRes.data.categories);
        if (newRes.data.success) setNewArrivals(newRes.data.products);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (instaRes.data.success) setInstagramPosts(instaRes.data.posts);
      } catch (error) {
        console.error('Home data load error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <SEOHelmet
        title="Ana Sayfa | Lüks Kadın Çanta Koleksiyonu"
        description="Nehir Çanta - Yeni sezon kadın omuz çantası, çapraz çanta, el çantası ve trend modelleri keşfedin. Kaliteli ve şık tasarımlar."
      />

      {/* Hero Section */}
      <HeroSlider slides={slides} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* New Arrivals Section */}
      <section className="py-16 md:py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brand-border">
            <div>
              <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
                SEZONUN YENİLERİ
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
                Yeni Gelenler
              </h2>
              <p className="text-sm text-brand-taupe mt-1">
                Sezonun en yeni kadın çanta modellerini keşfedin.
              </p>
            </div>

            <Link
              to="/yeni-gelenler"
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-luxury text-brand-primary hover:text-brand-gold transition-colors inline-flex items-center gap-1 self-start md:self-end"
            >
              Tümünü Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* Editorial / Lifestyle Section */}
      <EditorialBanner />

      {/* Featured Products / Sezonun Favorileri */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-brand-border">
              <div>
                <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
                  ÖNE ÇIKANLAR
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
                  Sezonun Favorileri
                </h2>
                <p className="text-sm text-brand-taupe mt-1">
                  En çok tercih edilen ve ilgi gören modeller.
                </p>
              </div>

              <Link
                to="/shop"
                className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-luxury text-brand-primary hover:text-brand-gold transition-colors inline-flex items-center gap-1 self-start md:self-end"
              >
                Koleksiyonu İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wholesale B2B Banner Preview */}
      <section className="py-14 bg-brand-primary text-brand-white border-y border-brand-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-charcoal border border-brand-taupe/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block">
                B2B & BUTİK SATIŞ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Toptan Çanta Satışı
              </h3>
              <p className="text-xs sm:text-sm text-brand-cream/80 max-w-lg mt-1">
                Mağazanız, butiğiniz veya online işletmeniz için toptan çanta siparişi vermek ve özel fiyat tekliflerimizi öğrenmek için başvuru yapabilirsiniz.
              </p>
            </div>
          </div>

          <Link
            to="/toptan"
            className="luxury-btn-gold whitespace-nowrap self-start md:self-center"
          >
            Toptan Bilgi Al <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Instagram Grid (@nehircanta2016) */}
      <InstagramGrid posts={instagramPosts} />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
};
