import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const path = location.pathname;

  let title = 'Politikalarımız';
  let content = <p>İçerik hazırlanmaktadır.</p>;

  if (path.includes('kargo-ve-teslimat')) {
    title = 'Kargo ve Teslimat Politikası';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <h3 className="font-serif text-xl font-bold text-brand-primary">1. Teslimat Süreci</h3>
        <p>
          Nehir Çanta üzerinden verilen siparişler, onaylandıktan sonra ortalama <strong>{settings.shippingSettings?.estimatedDeliveryDays || '2 - 4 iş günü'}</strong> içerisinde özenle paketlenerek anlaşmalı kargo firmalarına teslim edilir.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">2. Kargo Ücretleri</h3>
        <p>
          <strong>1000 TL ve üzeri</strong> siparişlerde kargo ücretsizdir. 1000 TL altındaki siparişler için standart kargo bedeli sepet ve ödeme aşamasında belirtilmektedir.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">3. Kargo Takibi</h3>
        <p>
          Siparişiniz kargoya teslim edildiğinde SMS ve e-posta yoluyla kargo takip numaranız iletilir. Sitemizdeki <strong>Sipariş Takibi</strong> sayfasından da durumunuzu kontrol edebilirsiniz.
        </p>
      </div>
    );
  } else if (path.includes('iade-ve-degisim')) {
    title = 'İade ve Değişim Koşulları';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <h3 className="font-serif text-xl font-bold text-brand-primary">1. İade Hakkı</h3>
        <p>
          6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, teslim aldığınız tarihten itibaren <strong>14 gün</strong> içerisinde herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">2. İade Şartları</h3>
        <p>
          İade edilecek çantaların kullanılmamış, etiketleri sökülmemiş, aksesuarları tam ve orijinal ambalajı bozulmamış olması gerekmektedir.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">3. İade Süreci</h3>
        <p>
          İade talebinizi WhatsApp destek hattımıza bildirerek anlaşmalı kargo iade kodumuzu alabilirsiniz. Ürün tarafımıza ulaşıp kontrolleri sağlandıktan sonra ödemeniz 3-7 iş günü içerisinde iade edilir.
        </p>
      </div>
    );
  } else if (path.includes('gizlilik-politikasi')) {
    title = 'Gizlilik Politikası';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <p>
          {settings.brandName || 'Nehir Çanta'} olarak ziyaretçilerimizin ve müşterilerimizin kişisel verilerinin gizliliğine ve güvenliğine büyük önem veriyoruz.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">Veri Güvenliği</h3>
        <p>
          Sipariş ve üyelik süreçlerinde paylaştığınız ad, soyad, telefon, adres ve e-posta bilgileri yalnızca siparişinizin teslimatı, faturalandırılması ve müşteri hizmetleri süreçlerinde kullanılmaktadır. Üçüncü şahıslarla asla ticari amaçla paylaşılmaz.
        </p>
      </div>
    );
  } else if (path.includes('mesafeli-satis-sozlesmesi')) {
    title = 'Mesafeli Satış Sözleşmesi';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <h3 className="font-serif text-xl font-bold text-brand-primary">MADDE 1 - TARAFLAR</h3>
        <p>
          <strong>Satıcı:</strong> {settings.brandName || 'Nehir Çanta'} ({settings.address})<br />
          <strong>Alıcı:</strong> Siparişi oluşturan müşteri
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">MADDE 2 - KONU</h3>
        <p>
          İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı çanta ve aksesuar ürünlerinin satışı ve teslimi ile ilgili olarak 6502 sayılı Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
        </p>
      </div>
    );
  } else if (path.includes('cerez-politikasi')) {
    title = 'Çerez (Cookie) Politikası';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <p>
          Web sitemizde kullanıcı deneyimini zenginleştirmek, sayfa performansını optimize etmek ve istatistiksel analiz yapabilmek amacıyla birinci ve üçüncü taraf çerezler kullanılmaktadır.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">Çerez Tercihlerini Yönetme</h3>
        <p>
          Tarayıcı ayarlarınızdan dilediğiniz zaman çerez kullanımını kısıtlayabilir veya sitemizin alt kısmındaki çerez tercihleri panelinden analitik çerezleri kapatabilirsiniz.
        </p>
      </div>
    );
  } else if (path.includes('kvkk-aydinlatma-metni')) {
    title = 'KVKK Aydınlatma Metni';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal leading-relaxed">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla {settings.brandName || 'Nehir Çanta'}, kişisel verilerinizi yasal mevzuata uygun olarak işlemektedir.
        </p>
        <h3 className="font-serif text-xl font-bold text-brand-primary">İşlenen Kişisel Veriler</h3>
        <p>
          Kimlik bilgileri (ad, soyad), iletişim bilgileri (telefon, e-posta, teslimat adresi), sipariş işlem ve müşteri işlem bilgileri KVKK madde 5/2 uyarınca sözleşmenin ifası amacıyla işlenmektedir.
        </p>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet title={`${title} | Nehir Çanta`} />

      <div className="bg-brand-cream/50 py-12 md:py-16 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
            YASAL BİLGİLENDİRME
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-10 shadow-sm">
          {content}
        </div>
      </div>
    </>
  );
};
