import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('nehir_canta_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'nehir_canta_cookie_consent',
      JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date() })
    );
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      'nehir_canta_cookie_consent',
      JSON.stringify({ necessary: true, analytics: false, marketing: false, date: new Date() })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'nehir_canta_cookie_consent',
      JSON.stringify({ necessary: true, analytics, marketing, date: new Date() })
    );
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-brand-primary text-brand-bg shadow-2xl border-t border-brand-charcoal">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 text-xs md:text-sm text-brand-cream/90">
          <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-brand-white mb-1">Çerez Kullanımı ve Gizlilik Bildirimi</p>
            <p>
              Deneyiminizi iyileştirmek, site trafiğimizi analiz etmek ve size özel içerikler sunabilmek amacıyla çerezler (cookies) kullanmaktayız. Ayrıntılı bilgi için{' '}
              <Link to="/cerez-politikasi" className="underline text-brand-gold hover:text-brand-white transition-colors">
                Çerez Politikamızı
              </Link>{' '}
              ve{' '}
              <Link to="/kvkk-aydinlatma-metni" className="underline text-brand-gold hover:text-brand-white transition-colors">
                KVKK Aydınlatma Metnini
              </Link>{' '}
              inceleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 text-xs uppercase tracking-wider text-brand-cream hover:text-brand-white underline transition-colors"
          >
            Tercihler
          </button>
          <button
            onClick={handleRejectAll}
            className="px-4 py-2 border border-brand-taupe/40 text-brand-cream hover:text-brand-white text-xs uppercase tracking-wider transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-5 py-2 bg-brand-gold hover:bg-brand-goldHover text-brand-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-brand-charcoal grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-brand-cream">
          <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded">
            <div>
              <span className="font-semibold text-brand-white">Zorunlu Çerezler</span>
              <p className="text-[11px] text-brand-taupe">Web sitesinin temel işlevleri için gereklidir.</p>
            </div>
            <span className="text-brand-gold font-bold">Aktif</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded">
            <div>
              <span className="font-semibold text-brand-white">Analitik Çerezler</span>
              <p className="text-[11px] text-brand-taupe">Ziyaretçi trafiği ve performans ölçümü.</p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="accent-brand-gold w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-brand-charcoal/50 rounded">
            <div>
              <span className="font-semibold text-brand-white">Pazarlama Çerezleri</span>
              <p className="text-[11px] text-brand-taupe">Kişiselleştirilmiş reklam ve kampanyalar.</p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="accent-brand-gold w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-1.5 bg-brand-white text-brand-primary text-xs font-semibold uppercase tracking-wider hover:bg-brand-cream transition-colors"
            >
              Tercihleri Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
