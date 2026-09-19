import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';

const FAQ_ITEMS = [
  {
    q: 'Siparişimi nasıl oluşturabilirim?',
    a: 'Web sitemiz üzerinden beğendiğiniz çantaları sepete ekleyerek güvenli ödeme adımlarını tamamlayabilir veya her ürün sayfasında yer alan "WhatsApp\'tan Bilgi Al" butonuna tıklayarak doğrudan müşteri temsilcimiz aracılığıyla siparişinizi verebilirsiniz.'
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: 'Banka Havalesi / EFT ve anlaşmalı kargo firmalarımız aracılığıyla Kapıda Ödeme (Nakit veya Kredi Kartı) yöntemleriyle güvenle alışveriş yapabilirsiniz.'
  },
  {
    q: 'Kargo ücreti ne kadar ve teslimat kaç gün sürer?',
    a: '1000 TL ve üzeri tüm alışverişlerinizde kargo ücretsizdir. 1000 TL altındaki siparişler için standart kargo ücreti 79.90 TL\'dir. Siparişleriniz 2-4 iş günü içerisinde anlaşmalı kargo firmasıyla adresinize teslim edilir.'
  },
  {
    q: 'İade ve değişim yapabilir miyim?',
    a: 'Evet, teslimat tarihinden itibaren 14 gün içerisinde kullanılmamış, etiketleri sökülmemiş ve orijinal ambalajı zarar görmemiş ürünler için iade ve değişim yapabilirsiniz.'
  },
  {
    q: 'Toptan çanta satışı yapıyor musunuz?',
    a: 'Evet, fiziksel butikler ve online satıcılar için toptan satış imkanımız mevcuttur. Toptan Satış sayfamızdaki formu doldurarak veya WhatsApp hattımızdan bizimle iletişime geçebilirsiniz.'
  },
  {
    q: 'Çantaların bakımı ve temizliği nasıl yapılmalıdır?',
    a: 'Tüm çanta modellerimizin hafif nemli ve yumuşak bir bezle silinerek temizlenmesi önerilir. Alkol, aseton, deterjan ve direkt güneş ışığından uzak tutulması tavsiye edilir.'
  }
];

export const FAQPage: React.FC = () => {
  const { settings } = useSettings();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <SEOHelmet
        title="Sıkça Sorulan Sorular (SSS) | Nehir Çanta"
        description="Nehir Çanta sipariş süreci, ödeme yöntemleri, kargo teslimatı ve iade koşulları hakkında sıkça sorulan sorular."
      />

      <div className="bg-brand-cream/50 py-14 md:py-20 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-brand-gold font-semibold block">
            YARDIM & DESTEK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-primary">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-sm text-brand-taupe max-w-lg mx-auto">
            Sipariş, kargo, ödeme ve ürünlerimiz hakkında aklınıza takılan tüm soruların cevapları.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="border border-brand-border rounded-sm overflow-hidden bg-brand-bg shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-brand-primary hover:bg-brand-cream/30 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-gold transition-transform duration-200 flex-shrink-0 ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-charcoal leading-relaxed border-t border-brand-border/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp support callout */}
        <div className="mt-12 p-8 bg-brand-cream/40 border border-brand-border rounded-sm text-center space-y-3">
          <h3 className="font-serif text-2xl font-bold text-brand-primary">
            Sorunuza cevap bulamadınız mı?
          </h3>
          <p className="text-xs text-brand-taupe max-w-md mx-auto">
            Müşteri temsilcimiz WhatsApp üzerinden tüm sorularınızı yanıtlamaktan memnuniyet duyacaktır.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${settings.whatsAppNumber.replace(/\D/g, '')}?text=Merhaba%20Nehir%20Çanta,%20bir%20sorum%20vardı.`}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn-whatsapp inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Destek Hattına Yazın
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
