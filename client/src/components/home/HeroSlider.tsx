import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '../../types';

interface HeroSliderProps {
  slides: HeroSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const current = slides[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[78vh] md:h-[86vh] overflow-hidden bg-brand-primary">
      {/* Background Image with Smooth Fade */}
      <div className="absolute inset-0">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform scale-100"
        />
        {/* Soft editorial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-brand-primary/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl text-brand-white space-y-4">
          {current.tagline && (
            <span className="inline-block text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold bg-brand-primary/40 backdrop-blur-sm px-3 py-1 rounded-sm">
              {current.tagline}
            </span>
          )}

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-brand-white">
            {current.title}
          </h1>

          {current.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-brand-cream/90 font-light max-w-lg leading-relaxed">
              {current.subtitle}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {current.ctaPrimaryText && (
              <Link
                to={current.ctaPrimaryLink || '/shop'}
                className="luxury-btn-primary bg-brand-white text-brand-primary hover:bg-brand-cream"
              >
                {current.ctaPrimaryText}
              </Link>
            )}

            {current.ctaSecondaryText && (
              <Link
                to={current.ctaSecondaryLink || '/yeni-gelenler'}
                className="luxury-btn-outline border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary"
              >
                {current.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows (if multi-slide) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex items-center gap-2 z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-brand-white/40 text-brand-white hover:bg-brand-white hover:text-brand-primary flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Önceki Slayt"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-brand-white/40 text-brand-white hover:bg-brand-white hover:text-brand-primary flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="Sonraki Slayt"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentIndex === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-white/50'
              }`}
              aria-label={`Slayt ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
