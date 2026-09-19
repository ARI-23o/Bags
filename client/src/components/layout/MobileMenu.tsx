import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Phone, MessageCircle, Instagram } from 'lucide-react';
import { Category, Collection } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  collections: Collection[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  categories,
  collections
}) => {
  const { settings } = useSettings();
  const [bagsOpen, setBagsOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-brand-bg h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-brand-border z-10">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <span className="font-serif text-2xl font-bold uppercase tracking-luxury text-brand-primary">
              {settings.brandName || 'NEHİR ÇANTA'}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-brand-primary hover:text-brand-taupe transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-5 space-y-4 text-sm font-semibold tracking-luxury uppercase">
            <Link
              to="/yeni-gelenler"
              onClick={onClose}
              className="block text-brand-primary hover:text-brand-gold py-1"
            >
              Yeni Gelenler
            </Link>

            {/* Bags Collapsible */}
            <div className="border-b border-brand-border/60 pb-2">
              <button
                onClick={() => setBagsOpen(!bagsOpen)}
                className="w-full flex items-center justify-between text-brand-primary py-1"
              >
                <span>Çantalar</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${bagsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {bagsOpen && (
                <div className="pl-4 pt-2 space-y-2 text-xs font-normal normal-case text-brand-charcoal">
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="block font-semibold text-brand-primary py-1"
                  >
                    Tüm Çantaları Gör →
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/kategori/${cat.slug}`}
                      onClick={onClose}
                      className="block hover:text-brand-gold py-1"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collections Collapsible */}
            <div className="border-b border-brand-border/60 pb-2">
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="w-full flex items-center justify-between text-brand-primary py-1"
              >
                <span>Koleksiyonlar</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {collectionsOpen && (
                <div className="pl-4 pt-2 space-y-2 text-xs font-normal normal-case text-brand-charcoal">
                  {collections.map((col) => (
                    <Link
                      key={col._id}
                      to={`/koleksiyon/${col.slug}`}
                      onClick={onClose}
                      className="block hover:text-brand-gold py-1"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/indirim"
              onClick={onClose}
              className="block text-brand-primary hover:text-brand-gold py-1"
            >
              Kampanyalar
            </Link>
            <Link
              to="/toptan"
              onClick={onClose}
              className="block text-brand-primary hover:text-brand-gold py-1"
            >
              Toptan Satış
            </Link>
            <Link
              to="/hakkimizda"
              onClick={onClose}
              className="block text-brand-primary hover:text-brand-gold py-1"
            >
              Hakkımızda
            </Link>
            <Link
              to="/iletisim"
              onClick={onClose}
              className="block text-brand-primary hover:text-brand-gold py-1"
            >
              İletişim
            </Link>
            <Link
              to="/siparis-takip"
              onClick={onClose}
              className="block text-brand-taupe hover:text-brand-primary py-1"
            >
              Sipariş Takibi
            </Link>
          </nav>
        </div>

        {/* Footer info & WhatsApp button */}
        <div className="p-5 border-t border-brand-border bg-brand-cream/40 space-y-3">
          <a
            href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=Merhaba%20Nehir%20Çanta`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full luxury-btn-whatsapp"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Destek
          </a>

          <div className="flex items-center justify-between text-xs text-brand-taupe pt-2">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1 hover:text-brand-primary"
            >
              <Phone className="w-3.5 h-3.5" />
              {settings.phone}
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
