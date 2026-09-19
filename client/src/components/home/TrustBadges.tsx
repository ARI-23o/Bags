import React from 'react';
import { Package, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const TrustBadges: React.FC = () => {
  const { settings } = useSettings();
  const badges = settings.trustBadges;

  if (!badges) return null;

  const badgeList = [
    {
      icon: Package,
      title: badges.badge1Title || 'Özenli Paketleme',
      subtitle: badges.badge1Subtitle || 'Her çanta özel koruyucu kılıfı ile özenle paketlenir.'
    },
    {
      icon: ShieldCheck,
      title: badges.badge2Title || 'Güvenli Ödeme',
      subtitle: badges.badge2Subtitle || 'Banka Havalesi / EFT ve Kapıda Ödeme imkanı.'
    },
    {
      icon: MessageCircle,
      title: badges.badge3Title || 'Hızlı İletişim',
      subtitle: badges.badge3Subtitle || 'WhatsApp destek hattımızdan anında bilgi alabilirsiniz.'
    },
    {
      icon: Sparkles,
      title: badges.badge4Title || 'Kalite Güvencesi',
      subtitle: badges.badge4Subtitle || 'Kusursuz dikiş ve seçkin malzeme kalitesi.'
    }
  ];

  return (
    <section className="py-12 bg-brand-bg border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badgeList.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-sm transition-colors hover:bg-brand-cream/40"
              >
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0 border border-brand-border/80">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-brand-primary mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-brand-taupe leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
