import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHelmet title="Sayfa Bulunamadı (404) | Nehir Çanta" />

      <div className="max-w-xl mx-auto px-4 py-24 md:py-32 text-center space-y-4">
        <span className="font-serif text-7xl md:text-9xl font-bold text-brand-gold">
          404
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">
          Sayfa Bulunamadı
        </h1>
        <p className="text-xs sm:text-sm text-brand-taupe max-w-sm mx-auto leading-relaxed">
          Aradığınız sayfa taşınmış, silinmiş veya adı değiştirilmiş olabilir.
        </p>
        <div className="pt-4">
          <Link to="/" className="luxury-btn-primary">
            <ShoppingBag className="w-4 h-4" /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </>
  );
};
