import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
            Koleksiyonları Keşfedin
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            Kategoriye Göre Alışveriş
          </h2>
          <p className="text-sm text-brand-taupe mt-2">
            İhtiyacınıza ve stilinize uygun en özel çanta formlarını inceleyin.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat._id}
              to={`/kategori/${cat.slug}`}
              className={`group relative overflow-hidden rounded-sm bg-brand-cream border border-brand-border/60 ${
                idx === 0 ? 'col-span-2 md:col-span-2 aspect-[16/9] md:aspect-auto md:row-span-2' : 'aspect-[4/5]'
              }`}
            >
              {/* Image */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/20 to-transparent transition-opacity duration-300 group-hover:from-brand-primary/90" />

              {/* Category Info */}
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex items-end justify-between text-brand-white">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-brand-white group-hover:text-brand-gold transition-colors">
                    {cat.name}
                  </h3>
                  {cat.productCount !== undefined && (
                    <span className="text-[11px] uppercase tracking-wider text-brand-beige">
                      {cat.productCount} Model
                    </span>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-brand-white/20 backdrop-blur-sm flex items-center justify-center text-brand-white group-hover:bg-brand-gold group-hover:text-brand-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
