import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-brand-primary text-brand-bg pt-16 pb-8 border-t border-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-charcoal">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl md:text-4xl font-bold tracking-luxury uppercase text-brand-white">
                {settings.brandName || 'NEHİR ÇANTA'}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-taupe mt-0.5">
                Kadın Çanta & Aksesuar Koleksiyonu
              </span>
            </Link>
            <p className="text-sm text-brand-cream/80 max-w-sm leading-relaxed">
              Zarafeti ve modern tasarımı bir araya getiren kadın çanta modellerimizle stilinizi her gün yeniden tamamlayın.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-charcoal hover:bg-brand-gold text-brand-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=Merhaba%20Nehir%20Çanta`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-charcoal hover:bg-[#25D366] text-brand-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-gold">
              Kurumsal
            </h4>
            <ul className="space-y-2 text-xs text-brand-cream/80 font-normal">
              <li>
                <Link to="/hakkimizda" className="hover:text-brand-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-brand-white transition-colors">
                  İletişim & Mağaza
                </Link>
              </li>
              <li>
                <Link to="/toptan" className="hover:text-brand-white transition-colors">
                  Toptan Satış (B2B)
                </Link>
              </li>
              <li>
                <Link to="/siparis-takip" className="hover:text-brand-white transition-colors">
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-gold">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2 text-xs text-brand-cream/80 font-normal">
              <li>
                <Link to="/kargo-ve-teslimat" className="hover:text-brand-white transition-colors">
                  Kargo ve Teslimat
                </Link>
              </li>
              <li>
                <Link to="/iade-ve-degisim" className="hover:text-brand-white transition-colors">
                  İade ve Değişim
                </Link>
              </li>
              <li>
                <Link to="/sss" className="hover:text-brand-white transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-white transition-colors">
                  Tüm Modeller
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs text-brand-cream/80 font-normal">
            <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-gold">
              İletişim
            </h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-taupe flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-taupe flex-shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-brand-white">
                {settings.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-taupe flex-shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-brand-white">
                {settings.email}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-taupe">
          <p>© {new Date().getFullYear()} Nehir Çanta. Tüm hakları saklıdır.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <Link to="/gizlilik-politikasi" className="hover:text-brand-cream transition-colors">
              Gizlilik Politikası
            </Link>
            <span>•</span>
            <Link to="/mesafeli-satis-sozlesmesi" className="hover:text-brand-cream transition-colors">
              Mesafeli Satış Sözleşmesi
            </Link>
            <span>•</span>
            <Link to="/cerez-politikasi" className="hover:text-brand-cream transition-colors">
              Çerez Politikası
            </Link>
            <span>•</span>
            <Link to="/kvkk-aydinlatma-metni" className="hover:text-brand-cream transition-colors">
              KVKK Metni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
