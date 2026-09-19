import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Product, Collection } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';
import { mockCollections, mockProducts } from '../services/mockData';

export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(() => mockCollections.find(c => c.slug === slug) || null);
  const [collectionsList, setCollectionsList] = useState<Collection[]>(mockCollections);
  const [products, setProducts] = useState<Product[]>(() => mockProducts.filter(p => p.collectionId?.slug === slug || (p.collectionId as any) === slug));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug) {
          const [colRes, prodRes] = await Promise.all([
            api.get(`/collections/${slug}`).catch(() => ({ data: { success: false } })),
            api.get(`/products?collection=${slug}&limit=24`).catch(() => ({ data: { success: false } }))
          ]);

          if (colRes.data?.success && colRes.data.collection) setCollection(colRes.data.collection);
          if (prodRes.data?.success && prodRes.data.products?.length > 0) setProducts(prodRes.data.products);
        } else {
          // List all collections
          const res = await api.get('/collections').catch(() => ({ data: { success: false } }));
          if (res.data?.success && res.data.collections?.length > 0) setCollectionsList(res.data.collections);
        }
      } catch (err) {
        console.warn('Using local collection mock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug) {
    return (
      <>
        <SEOHelmet title="Koleksiyonlar | Nehir Çanta" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
              ÖZEL SEÇKİLER
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
              Koleksiyonlarımızı Keşfedin
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collectionsList.map((col) => (
              <Link
                key={col._id}
                to={`/koleksiyon/${col.slug}`}
                className="group block relative aspect-[4/5] overflow-hidden rounded-sm bg-brand-cream border border-brand-border"
              >
                <img
                  src={col.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'}
                  alt={col.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-brand-white">
                  <h3 className="font-serif text-2xl font-bold text-brand-white group-hover:text-brand-gold transition-colors">
                    {col.name}
                  </h3>
                  {col.subtitle && (
                    <p className="text-xs text-brand-cream/80 mt-1">{col.subtitle}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }

  const title = collection?.name || 'Koleksiyon';

  return (
    <>
      <SEOHelmet
        title={`${title} | Nehir Çanta Koleksiyonu`}
        description={collection?.description || `${title} özel kadın çanta koleksiyonu.`}
      />

      <div className="bg-brand-primary text-brand-white py-14 md:py-20 border-b border-brand-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold block">
            ÖZEL SEÇKİ
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
            {title}
          </h1>
          {collection?.subtitle && (
            <p className="text-xs sm:text-sm text-brand-cream/80 leading-relaxed font-light">
              {collection.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-brand-cream animate-pulse rounded-sm" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-brand-cream/30 border border-brand-border rounded-sm">
            <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
              Bu Koleksiyonda Henüz Ürün Bulunmuyor
            </h3>
            <Link to="/shop" className="luxury-btn-primary mt-4">
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
