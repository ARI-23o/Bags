import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Instagram } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <>
      <SEOHelmet
        title="Hakkımızda | Nehir Çanta Hikayesi"
        description="Nehir Çanta - 2016'dan bu yana kadın modasını zarif ve fonksiyonel çanta modelleriyle buluşturan Türk moda markası."
      />

      {/* Hero */}
      <div className="bg-brand-cream/50 py-16 md:py-24 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-gold font-semibold block">
            BİZİM HİKAYEMİZ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-brand-primary">
            Tarzınızı ve Zarafetinizi Tamamlayan Çantalar
          </h1>
          <p className="text-sm sm:text-base text-brand-taupe max-w-2xl mx-auto leading-relaxed">
            Nehir Çanta, kadın modasında şıklığı, kaliteyi ve erişilebilir lüksü bir araya getirme vizyonuyla 2016 yılında yola çıktı.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] rounded-sm overflow-hidden bg-brand-cream border border-brand-border shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
              alt="Nehir Çanta Tasarım"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-sm text-brand-charcoal leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-brand-primary">
              Bir Çantadan Fazlası: Özgün Duruş
            </h2>
            <p>
              Bir kadının çantası sadece eşyalarını taşıdığı bir aksesuar değil; onun tarzını, enerjisini ve gün içerisindeki duruşunu yansıtan en önemli detaydır.
            </p>
            <p>
              Kurulduğumuz günden itibaren Instagram sayfamız (<strong>@nehircanta2016</strong>) ve mağazamız aracılığıyla on binlerce kadının kombinlerine dokunduk. Şimdi resmi web sitemizle bu deneyimi daha hızlı, güvenli ve keyifli hale getiriyoruz.
            </p>
            <p>
              Her yeni sezonda en güncel renkleri, kaliteli dikiş işçiliğini ve fonksiyonel iç bölmeleri modellerimize taşıyoruz.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-brand-cream/30 border border-brand-border rounded-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary text-brand-gold flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Özenli Tasarım
            </h3>
            <p className="text-xs text-brand-taupe leading-relaxed">
              Hem günlük tempoya hem de özel davetlere uyum sağlayan zamansız formlar.
            </p>
          </div>

          <div className="p-8 bg-brand-cream/30 border border-brand-border rounded-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary text-brand-gold flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Kalite & Dayanıklılık
            </h3>
            <p className="text-xs text-brand-taupe leading-relaxed">
              Seçkin vegan deri materyaller, sağlam dikişler ve dayanıklı metal aksesuarlar.
            </p>
          </div>

          <div className="p-8 bg-brand-cream/30 border border-brand-border rounded-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary text-brand-gold flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Müşteri Memnuniyeti
            </h3>
            <p className="text-xs text-brand-taupe leading-relaxed">
              Sipariş öncesi ve sonrasında WhatsApp destek hattımızla daima yanınızdayız.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-brand-primary text-brand-white p-12 rounded-sm space-y-4">
          <h3 className="font-serif text-3xl sm:text-4xl font-bold">
            Stilinizi Nehir Çanta ile Keşfedin
          </h3>
          <p className="text-xs sm:text-sm text-brand-cream/80 max-w-md mx-auto">
            Yeni sezon koleksiyonumuza göz atın veya bizi Instagram'da takip edin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/shop" className="luxury-btn-gold">
              Koleksiyonu İncele
            </Link>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn-outline border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary"
            >
              <Instagram className="w-4 h-4" /> @nehircanta2016
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
