import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import SiteSettings from '../models/SiteSettings.js';
import Admin from '../models/Admin.js';
import HeroSlide from '../models/HeroSlide.js';
import InstagramPost from '../models/InstagramPost.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nehircanta';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Veritabanına bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Bağlantı başarılı.');

    // Clear existing data
    console.log('[Seed] Eski veriler temizleniyor...');
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      SiteSettings.deleteMany({}),
      Admin.deleteMany({}),
      HeroSlide.deleteMany({}),
      InstagramPost.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // 1. Create Super Admin
    console.log('[Seed] Yönetici hesabı oluşturuluyor...');
    const admin = await Admin.create({
      name: 'Nehir Çanta Yönetici',
      email: 'admin@nehircanta.com',
      password: 'admin123456',
      role: 'super_admin'
    });
    console.log(`[Seed] Yönetici oluşturuldu: ${admin.email} (Şifre: admin123456)`);

    // 2. Create Site Settings
    console.log('[Seed] Mağaza ayarları yapılandırılıyor...');
    await SiteSettings.create({
      brandName: 'NEHİR ÇANTA',
      tagline: 'Zarafetin ve Tarzın Buluşma Noktası',
      phone: '+90 532 000 00 00',
      whatsAppNumber: '905320000000',
      email: 'info@nehircanta.com',
      address: 'Nişantaşı, Teşvikiye Cad. No:42, Şişli / İstanbul',
      openingHours: 'Pazartesi - Cumartesi: 09:30 - 19:30',
      instagramUrl: 'https://www.instagram.com/nehircanta2016/',
      currency: { code: 'TRY', symbol: '₺' },
      shippingSettings: {
        standardRate: 79.90,
        freeShippingThreshold: 1000,
        isFreeShippingEnabled: true,
        estimatedDeliveryDays: '2 - 4 İş Günü'
      },
      paymentMethods: {
        havaleEftEnabled: true,
        kapidaOdemeEnabled: true,
        kapidaOdemeFee: 29.90,
        creditCardEnabled: false
      },
      bankAccounts: [{
        bankName: 'Ziraat Bankası',
        accountHolder: 'Nehir Çanta Tic. Ltd. Şti.',
        iban: 'TR12 0001 0000 1234 5678 9012 34',
        branchCode: 'Kadıköy Şubesi (1234)'
      }],
      announcementBar: {
        isEnabled: true,
        text: 'Yeni Sezon Kadın Çanta Koleksiyonumuz Yayında! 1000 TL Üzeri Siparişlerde Kargo Bedava.',
        link: '/shop'
      }
    });

    // 3. Create Categories
    console.log('[Seed] Kategoriler ekleniyor...');
    const categoriesData = [
      {
        name: 'Omuz Çantaları',
        slug: 'omuz-cantalari',
        description: 'Günlük hayatınızda hem şıklığı hem konforu bir arada sunan zarif omuz çantaları.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        order: 1
      },
      {
        name: 'Çapraz Çantalar',
        slug: 'capraz-cantalar',
        description: 'Ellerinizi özgür bırakan, fonksiyonel ve modern tasarımlı çapraz askılı modeller.',
        image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
        order: 2
      },
      {
        name: 'El Çantaları',
        slug: 'el-cantalari',
        description: 'Özel davetlerde ve şık kombinlerinizde dikkat çeken baget ve el çantası modelleri.',
        image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        order: 3
      },
      {
        name: 'Mini Çantalar',
        slug: 'mini-cantalar',
        description: 'Kompakt boyutları ve iddialı detaylarıyla stilinizin en tatlı tamamlayıcısı.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        order: 4
      },
      {
        name: 'Tote Çantalar',
        slug: 'tote-cantalar',
        description: 'Geniş iç hacmi ile iş, okul ve seyahatleriniz için ideal büyük çanta seçenekleri.',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        order: 5
      },
      {
        name: 'Sırt Çantaları',
        slug: 'sirt-cantalari',
        description: 'Şehir hayatının dinamizmine uyum sağlayan modern kadın sırt çantaları.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        order: 6
      },
      {
        name: 'Cüzdan & Aksesuar',
        slug: 'cuzdan-aksesuar',
        description: 'Çantanızla mükemmel uyum sağlayan şık cüzdanlar ve çanta aksesuarları.',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        order: 7
      }
    ];
    const createdCategories = await Category.insertMany(categoriesData);

    // 4. Create Collections
    console.log('[Seed] Koleksiyonlar ekleniyor...');
    const collectionsData = [
      {
        name: '2026 İlkbahar/Yaz Koleksiyonu',
        slug: '2026-ilkbahar-yaz',
        subtitle: 'Canlı tonlar ve hafif dokular',
        description: 'Sezonun en taze renkleri ve ferah tasarımlarıyla hazırlanan yeni koleksiyon.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        order: 1
      },
      {
        name: 'Zamansız Klasikler',
        slug: 'zamansiz-klasikler',
        subtitle: 'Asla modası geçmeyen ikonik formlar',
        description: 'Her gardırobun vazgeçilmezi olan şık ve dayanıklı çantalar.',
        image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
        order: 2
      },
      {
        name: 'Gece & Davet Seçkisi',
        slug: 'gece-davet-seckisi',
        subtitle: 'Işıltılı geceler için özel parçalar',
        description: 'Zincir ve metalik detaylarla zenginleştirilmiş abiye modeller.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        order: 3
      }
    ];
    const createdCollections = await Collection.insertMany(collectionsData);

    // 5. Create Products
    console.log('[Seed] Demo çantalar ekleniyor...');
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });

    const colMap = {};
    createdCollections.forEach(c => { colMap[c.slug] = c._id; });

    const productsData = [
      {
        title: 'Siyah Kapitone Omuz Çantası',
        slug: 'siyah-kapitone-omuz-cantasi',
        sku: 'NC-OMZ-001',
        category: catMap['omuz-cantalari'],
        collectionId: colMap['zamansiz-klasikler'],
        price: 1299.90,
        comparePrice: 1599.90,
        stock: 14,
        primaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Siyah', hexCode: '#191817', stock: 8 },
          { name: 'Krem', hexCode: '#F4ECE1', stock: 6 }
        ],
        shortDescription: 'Özel kapitone dikişli, altın rengi zincir askılı lüks omuz çantası.',
        description: 'Nehir Çanta özel tasarım kapitone omuz çantası, yumuşak dokulu premium suni deri ve dayanıklı altın kaplama metal aksesuarlarla üretilmiştir. Hem günlük hem de şık davet kombinlerinizin anahtar parçasıdır.',
        material: 'Premium Vegan Deri',
        dimensions: { width: '28 cm', height: '18 cm', depth: '8 cm' },
        strapType: 'Deri Korumalı Çift Altın Zincir Askı',
        closure: 'Manyetik Kilit & İç Fermuar',
        interiorDetails: 'Astarlı çift ana bölme ve fermuarlı iç cep',
        isNewArrival: true,
        isFeatured: true,
        isSale: true,
        status: 'active'
      },
      {
        title: 'Bej Minimal Baget Çanta',
        slug: 'bej-minimal-baget-canta',
        sku: 'NC-BGT-002',
        category: catMap['el-cantalari'],
        collectionId: colMap['2026-ilkbahar-yaz'],
        price: 949.00,
        comparePrice: 1199.00,
        stock: 9,
        primaryImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Bej', hexCode: '#D8C9B8', stock: 5 },
          { name: 'Taba', hexCode: '#9E5B32', stock: 4 }
        ],
        shortDescription: 'Modern 90\'lar stili baget çanta, minimal ve zarif hatlar.',
        description: 'Zarif silüetiyle zamansız bir stil vadeden Bej Baget Çanta, kompakt yapısına rağmen telefon, cüzdan ve temel makyaj malzemelerinizi rahatça taşır.',
        material: 'Mat Dokulu Suni Deri',
        dimensions: { width: '26 cm', height: '14 cm', depth: '6 cm' },
        strapType: 'Sabit Kısa Omuz Askısı',
        closure: 'Üst Metal Fermuar',
        interiorDetails: 'Keten astar ve kartlık cebi',
        isNewArrival: true,
        isFeatured: true,
        isSale: false,
        status: 'active'
      },
      {
        title: 'Taba Deri Tote Alışveriş Çantası',
        slug: 'taba-deri-tote-canta',
        sku: 'NC-TOT-003',
        category: catMap['tote-cantalar'],
        collectionId: colMap['zamansiz-klasikler'],
        price: 1499.00,
        comparePrice: 1799.00,
        stock: 7,
        primaryImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Taba', hexCode: '#9E5B32', stock: 4 },
          { name: 'Siyah', hexCode: '#191817', stock: 3 }
        ],
        shortDescription: 'Geniş iç hacimli, laptop ve evrak uyumlu şık tote çanta.',
        description: 'Gün boyu yanınızda olmasını istediğiniz her şeyi güvenle taşıyabileceğiniz geniş tote çanta. 13 inç laptop ile uyumludur.',
        material: 'Kalın Dokulu Premium Vegan Deri',
        dimensions: { width: '38 cm', height: '30 cm', depth: '14 cm' },
        strapType: 'Uzun Çift Omuz Kulpu',
        closure: 'Mıknatıslı Çıtçıt & Fermuar',
        interiorDetails: 'Geniş bölme, fermuarlı cüzdan bölmesi',
        isNewArrival: false,
        isFeatured: true,
        isSale: false,
        status: 'active'
      },
      {
        title: 'Zincir Askılı Çapraz Mini Çanta',
        slug: 'zincir-askili-capraz-mini-canta',
        sku: 'NC-MIN-004',
        category: catMap['mini-cantalar'],
        collectionId: colMap['gece-davet-seckisi'],
        price: 890.00,
        comparePrice: 1050.00,
        stock: 12,
        primaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Soft Taupe', hexCode: '#A79A8C', stock: 6 },
          { name: 'Siyah', hexCode: '#191817', stock: 6 }
        ],
        shortDescription: 'Gece ve gündüz stiline ışıltı katan metalik detaylı mini çanta.',
        description: 'Şık metal kilit mekanizması ve dökümlü zincir askısıyla dikkat çeken mini çanta.',
        material: 'Yarı Parlak Vegan Deri',
        dimensions: { width: '20 cm', height: '13 cm', depth: '5 cm' },
        strapType: 'Ayarlanabilir Altın Zincir Askı',
        closure: 'Özel Tasarım Metal Klips',
        interiorDetails: 'Süet hisli astar',
        isNewArrival: true,
        isFeatured: false,
        isSale: true,
        status: 'active'
      },
      {
        title: 'Vizon Kroko Desen Çapraz Çanta',
        slug: 'vizon-kroko-desen-capraz-canta',
        sku: 'NC-CPZ-005',
        category: catMap['capraz-cantalar'],
        collectionId: colMap['2026-ilkbahar-yaz'],
        price: 1149.00,
        comparePrice: 1350.00,
        stock: 3, // Low stock test
        primaryImage: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Vizon', hexCode: '#A79A8C', stock: 3 }
        ],
        shortDescription: 'Timsah dokulu kroko kabartma, ayarlanabilir geniş kolon askılı model.',
        description: 'Göz alıcı kroko deseniyle lüks bir dokunuş kazanan çapraz çanta, hem spor hem klasik kombinlere mükemmel uyum sağlar.',
        material: 'Kroko Kabartmalı Vegan Deri',
        dimensions: { width: '24 cm', height: '16 cm', depth: '7 cm' },
        strapType: 'Geniş Dokuma Kolon Askı + İnce Deri Askı',
        closure: 'Çift Yönlü Fermuar',
        interiorDetails: 'Telefon bölmesi ve fermuarlı cep',
        isNewArrival: true,
        isFeatured: true,
        isSale: false,
        status: 'active'
      },
      {
        title: 'Antrasit Şehir Sırt Çantası',
        slug: 'antrasit-sehir-sirt-cantasi',
        sku: 'NC-SRT-006',
        category: catMap['sirt-cantalari'],
        collectionId: colMap['zamansiz-klasikler'],
        price: 1380.00,
        comparePrice: 1600.00,
        stock: 8,
        primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        colors: [
          { name: 'Antrasit', hexCode: '#3D3D3D', stock: 5 },
          { name: 'Siyah', hexCode: '#191817', stock: 3 }
        ],
        shortDescription: 'Su itici özellikli, çok cepli ergonomik kadın sırt çantası.',
        description: 'Yoğun şehir günlerinde ağırlığı dengeli dağıtan, şık metal fermuarlara sahip pratik sırt çantası.',
        material: 'Su İtici İmpermeabl Kumaş & Deri Detaylar',
        dimensions: { width: '30 cm', height: '35 cm', depth: '12 cm' },
        strapType: 'Yastıklı Ayarlanabilir Omuz Askıları',
        closure: 'Gizli Fermuar',
        interiorDetails: 'Tablet bölmesi ve 3 adet iç organizer cep',
        isNewArrival: false,
        isFeatured: false,
        isSale: false,
        status: 'active'
      }
    ];

    await Product.insertMany(productsData);

    // 6. Create Hero Slides
    console.log('[Seed] Hero slaytları ekleniyor...');
    await HeroSlide.insertMany([
      {
        title: 'Tarzını Tamamlayan Çantalar',
        subtitle: 'Yeni sezon kadın çanta koleksiyonumuzla zarafetinizi öne çıkarın.',
        tagline: '2026 İLKBAHAR / YAZ KOLEKSİYONU',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1920&q=85',
        ctaPrimaryText: 'KOLEKSİYONU KEŞFET',
        ctaPrimaryLink: '/shop',
        ctaSecondaryText: 'YENİ GELENLER',
        ctaSecondaryLink: '/yeni-gelenler',
        order: 1,
        isActive: true
      },
      {
        title: 'Zamansız ve Kusursuz Detaylar',
        subtitle: 'Her anınıza eşlik edecek en seçkin modeller Nehir Çanta\'da.',
        tagline: 'ÖZEL İŞÇİLİK & KALİTE',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1920&q=85',
        ctaPrimaryText: 'TÜM MODELLER',
        ctaPrimaryLink: '/shop',
        ctaSecondaryText: 'OMUZ ÇANTALARI',
        ctaSecondaryLink: '/kategori/omuz-cantalari',
        order: 2,
        isActive: true
      }
    ]);

    // 7. Create Instagram Feed Posts
    console.log('[Seed] Instagram vitrini ekleniyor...');
    await InstagramPost.insertMany([
      {
        mediaUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        caption: 'Günün kombini: Siyah Kapitone Omuz Çantası ✨ @nehircanta2016',
        likes: 428,
        productSlug: 'siyah-kapitone-omuz-cantasi',
        order: 1,
        isActive: true
      },
      {
        mediaUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
        caption: 'Minimalist ve şık: Bej Baget Çantamız stoklarda! 🤍',
        likes: 312,
        productSlug: 'bej-minimal-baget-canta',
        order: 2,
        isActive: true
      },
      {
        mediaUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
        caption: 'Vizon Kroko Çapraz Çanta ile stilinizi yükseltin. 🤎',
        likes: 589,
        productSlug: 'vizon-kroko-desen-capraz-canta',
        order: 3,
        isActive: true
      },
      {
        mediaUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        caption: 'Altın zincir detaylı mini çanta ✨ Özel davetlerin vazgeçilmezi.',
        likes: 275,
        productSlug: 'zincir-askili-capraz-mini-canta',
        order: 4,
        isActive: true
      },
      {
        mediaUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        caption: 'Geniş, kullanışlı ve zarif: Taba Tote Çanta 💼',
        likes: 461,
        productSlug: 'taba-deri-tote-canta',
        order: 5,
        isActive: true
      },
      {
        mediaUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        caption: 'Şehir hayatının konforu: Antrasit Sırt Çantası 🎒',
        likes: 340,
        productSlug: 'antrasit-sehir-sirt-cantasi',
        order: 6,
        isActive: true
      }
    ]);

    // 8. Create Coupons
    console.log('[Seed] Kampanya kuponları ekleniyor...');
    await Coupon.insertMany([
      {
        code: 'HOSGELDIN10',
        discountType: 'percent',
        discountValue: 10,
        minOrderAmount: 500,
        isActive: true
      },
      {
        code: 'NEHIR100',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 1000,
        isActive: true
      }
    ]);

    console.log('==================================================');
    console.log('[Seed] VERİTABANI BAŞARIYLA DOLDURULDU!');
    console.log('Yönetici Girişi: admin@nehircanta.com / admin123456');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Hatası]', error);
    process.exit(1);
  }
};

seedDatabase();
