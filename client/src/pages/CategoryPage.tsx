import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';
import { mockCategories, mockProducts } from '../services/mockData';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(() => mockCategories.find(c => c.slug === slug) || null);
  const [products, setProducts] = useState<Product[]>(() => mockProducts.filter(p => p.category?.slug === slug || (p.category as any) === slug));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`).catch(() => ({ data: { success: false } })),
          api.get(`/products?category=${slug}&limit=24`).catch(() => ({ data: { success: false } }))
        ]);

        if (catRes.data?.success && catRes.data.category) setCategory(catRes.data.category);
        if (prodRes.data?.success && prodRes.data.products?.length > 0) setProducts(prodRes.data.products);
      } catch (err) {
        console.warn('Using local category mock data');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryAndProducts();
    window.scrollTo(0, 0);
  }, [slug]);

  const title = category?.name || 'Kategori';

  return (
    <>
      <SEOHelmet
        title={`${title} Modelleri | Nehir Çanta`}
        description={category?.description || `${title} kategorisindeki en yeni ve şık kadın çanta modelleri.`}
      />

      {/* Header Banner */}
      <div className="bg-brand-cream/50 py-12 md:py-16 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
            KATEGORİ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            {title}
          </h1>
          {category?.description && (
            <p className="text-xs sm:text-sm text-brand-taupe mt-2 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-brand-cream animate-pulse rounded-sm" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream/30 border border-brand-border rounded-sm">
            <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
              Bu Kategoride Henüz Ürün Bulunmuyor
            </h3>
            <p className="text-xs text-brand-taupe mb-6">
              Yeni modellerimiz çok yakında eklenecektir.
            </p>
            <Link to="/shop" className="luxury-btn-primary">
              Tüm Çantaları Gör
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
