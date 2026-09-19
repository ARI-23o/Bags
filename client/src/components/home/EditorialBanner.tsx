import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-brand-cream/50 border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Image */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-brand-primary/10 border border-brand-border">
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"
                alt="Nehir Çanta Lifestyle"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 rounded-sm overflow-hidden border-4 border-brand-bg shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80"
                alt="Detay"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Editorial Copy */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <span className="text-xs font-semibold uppercase tracking-luxury text-brand-gold">
              EDİTÖRÜN SEÇİMİ
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary leading-tight">
              Stiline Uygun Bir Model
            </h2>

            <p className="text-sm md:text-base text-brand-charcoal leading-relaxed">
              Günlük sade kombinlerden özel davet ışıltılarına kadar her anınıza eşlik edecek en trend çanta modellerini Nehir Çanta kalitesiyle keşfedin. Kusursuz dikişler, fonksiyonel iç bölmeler ve seçkin tasarım hatları.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="luxury-btn-primary inline-flex items-center gap-2"
              >
                Koleksiyonu Keşfet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
