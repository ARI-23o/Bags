import { Product, Category, Collection, HeroSlide, InstagramPost } from '../types';

export const mockCategories: Category[] = [
  {
    _id: 'cat-1',
    name: 'Omuz Çantası',
    slug: 'omuz-cantasi',
    description: 'Günlük şıklığı ve fonksiyonelliği bir arada sunan seçkin omuz çantaları.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true
  },
  {
    _id: 'cat-2',
    name: 'Çapraz Çanta (Crossbody)',
    slug: 'capraz-canta',
    description: 'Hafif, dinamik ve eller serbest kullanım konforu sağlayan çapraz çantalar.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true
  },
  {
    _id: 'cat-3',
    name: 'El Çantası & Tote',
    slug: 'el-cantasi-tote',
    description: 'Geniş iç hacmi ve sofistike hatları ile iş ve şehir yaşamının vazgeçilmezi.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true
  },
  {
    _id: 'cat-4',
    name: 'Gece & Abiye Çantası',
    slug: 'gece-ve-abiye-cantasi',
    description: 'Özel davetlerde zarafetinizi tamamlayacak ışıltılı ve lüks abiye çantalar.',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isActive: true
  },
  {
    _id: 'cat-5',
    name: 'Sırt Çantası',
    slug: 'sirt-cantasi',
    description: 'Şık ve ergonomik kadın sırt çantası modelleri.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    order: 5,
    isActive: true
  },
  {
    _id: 'cat-6',
    name: 'Baget Çanta',
    slug: 'baget-canta',
    description: 'Zamansız 90lar nostaljisi ve modern baget kesimleri.',
    image: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80',
    order: 6,
    isActive: true
  }
];

export const mockCollections: Collection[] = [
  {
    _id: 'col-1',
    name: 'Şehirli Şıklık 2026',
    slug: 'sehirli-siklik-2026',
    description: 'Metropol temposuna uyum sağlayan modern ve zarif çizgiler.',
    bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    isActive: true
  },
  {
    _id: 'col-2',
    name: 'Özel Gece Koleksiyonu',
    slug: 'ozel-gece-koleksiyonu',
    description: 'Davetlerde ve kutlamalarda göz kamaştıran abiye ve zincirli modeller.',
    bannerImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1600&q=80',
    isActive: true
  }
];

export const mockHeroSlides: HeroSlide[] = [
  {
    _id: 'slide-1',
    title: 'Yeni Sezon Zarafeti',
    subtitle: 'Zamansız Tasarımlar, Kusursuz Detaylar',
    ctaPrimaryText: 'Koleksiyonu Keşfet',
    ctaPrimaryLink: '/shop',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
    order: 1,
    isActive: true
  },
  {
    _id: 'slide-2',
    title: 'İtalyan Dokusu & Şehir Şıklığı',
    subtitle: 'Modern Kadının Vazgeçilmez Aksesuarı',
    ctaPrimaryText: 'Yeni Gelenler',
    ctaPrimaryLink: '/yeni-gelenler',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1920&q=85',
    order: 2,
    isActive: true
  }
];

export const mockInstagramPosts: InstagramPost[] = [
  {
    _id: 'ig-1',
    caption: 'Venedik Baget Çanta ile günün kombin ilhamı ✨ @nehircanta2016',
    mediaUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 1,
    isActive: true
  },
  {
    _id: 'ig-2',
    caption: 'Kruvaze omuz çantası detayları. Yumuşacık doku & altın toka.',
    mediaUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 2,
    isActive: true
  },
  {
    _id: 'ig-3',
    caption: 'Ofis şıklığı için geniş iç hacimli Tote Çanta modellerimiz stokta!',
    mediaUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 3,
    isActive: true
  },
  {
    _id: 'ig-4',
    caption: 'Özel davetlerin gözdesi: Gece ışıltısı zincir askılı modelimiz 💫',
    mediaUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 4,
    isActive: true
  },
  {
    _id: 'ig-5',
    caption: 'Hafta sonu rahatlığı: Çok bölmeli pratik sırt çantası',
    mediaUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 5,
    isActive: true
  },
  {
    _id: 'ig-6',
    caption: 'Krem & Vizon tonlarının asaleti. Sipariş için profildeki linke tıklayın.',
    mediaUrl: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=600&q=80',
    permalink: 'https://www.instagram.com/nehircanta2016/',
    order: 6,
    isActive: true
  }
];

export const mockProducts: Product[] = [
  {
    _id: 'prod-1',
    title: 'Venedik Kapitone Zincirli Omuz Çantası',
    slug: 'venedik-kapitone-zincirli-omuz-cantasi',
    sku: 'NC-2026-001',
    description: 'Lüks kapitone dikiş detayları, altın tonlu metal zincir askısı ve yumuşak dokusu ile hem gündüz hem gece kullanımına uygun zarif omuz çantası. İçerisinde fermuarlı güvenlik cebi ve telefon bölmesi bulunmaktadır.',
    price: 1299.00,
    comparePrice: 1599.00,
    category: mockCategories[0],
    collectionId: mockCollections[0],
    primaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Siyah', hexCode: '#191817', stock: 10 },
      { name: 'Vizon', hexCode: '#A79A8C', stock: 8 },
      { name: 'Krem', hexCode: '#F4EFEA', stock: 6 }
    ],
    material: 'Birinci Sınıf Vegan Deri',
    dimensions: { width: '28 cm', height: '18 cm', depth: '8 cm' },
    stock: 24,
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    tags: ['omuz çantası', 'kapitone', 'altın zincir', 'lüks', 'trend']
  },
  {
    _id: 'prod-2',
    title: 'Milano Klasik Kilitli El ve Kol Çantası',
    slug: 'milano-klasik-kilitli-el-ve-kol-cantasi',
    sku: 'NC-2026-002',
    description: 'Sert gövde formu, metal kilit detayı ve çıkarılabilir uzun omuz askısı ile iş kadınlarının ve zarif stillerin vazgeçilmez modeli. Geniş iç hacmiyle tablet ve günlük ihtiyaçlarınızı rahatlıkla taşır.',
    price: 1450.00,
    comparePrice: 1750.00,
    category: mockCategories[2],
    collectionId: mockCollections[0],
    primaryImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Taba', hexCode: '#8B4513', stock: 6 },
      { name: 'Siyah', hexCode: '#191817', stock: 5 },
      { name: 'Bordo', hexCode: '#6B1D2F', stock: 4 }
    ],
    material: 'Dokulu Suni Deri',
    dimensions: { width: '32 cm', height: '24 cm', depth: '12 cm' },
    stock: 15,
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    tags: ['el çantası', 'iş çantası', 'taba', 'kilitli']
  },
  {
    _id: 'prod-3',
    title: 'Paris Vintage Baget Çanta',
    slug: 'paris-vintage-baget-canta',
    sku: 'NC-2026-003',
    description: '90lar silüetinin en trend yorumu. Kısa kol askısı ve minimal hatları ile stilinizi anında yükselten hafif ve kompakt tasarım.',
    price: 899.00,
    comparePrice: 1099.00,
    category: mockCategories[5],
    collectionId: mockCollections[0],
    primaryImage: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Açık Bej', hexCode: '#E6D7C3', stock: 12 },
      { name: 'Siyah', hexCode: '#191817', stock: 10 },
      { name: 'Zeytin Yeşili', hexCode: '#556B2F', stock: 8 }
    ],
    material: 'Pürüzsüz Vegan Deri',
    dimensions: { width: '26 cm', height: '14 cm', depth: '6 cm' },
    stock: 30,
    isFeatured: true,
    isNewArrival: false,
    status: 'active',
    tags: ['baget', 'vintage', 'bej', 'omuz çantası']
  },
  {
    _id: 'prod-4',
    title: 'Floransa Mini Çapraz Kutu Çanta',
    slug: 'floransa-mini-capraz-kutu-canta',
    sku: 'NC-2026-004',
    description: 'Ayarlanabilir çapraz askısı, hafif yapısı ve şık metal tokası ile günlük gezilerde eller serbest konfor sağlar.',
    price: 799.00,
    comparePrice: 950.00,
    category: mockCategories[1],
    collectionId: mockCollections[0],
    primaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Haki', hexCode: '#556B2F', stock: 7 },
      { name: 'Hardal', hexCode: '#DAA520', stock: 5 },
      { name: 'Siyah', hexCode: '#191817', stock: 6 }
    ],
    material: 'Yumuşak Dokulu Suni Deri',
    dimensions: { width: '22 cm', height: '16 cm', depth: '7 cm' },
    stock: 18,
    isFeatured: false,
    isNewArrival: true,
    status: 'active',
    tags: ['çapraz çanta', 'mini çanta', 'günlük']
  },
  {
    _id: 'prod-5',
    title: 'Monaco Kristal Taşlı Abiye Portföy Çanta',
    slug: 'monaco-kristal-tasli-abiye-portfoy-canta',
    sku: 'NC-2026-005',
    description: 'Özel düğün, nişan ve davet gecelerinde tüm gözleri üzerinize çekecek ışıltılı kristal taş işlemeleri ve çıkarılabilir ince altın zincir askısı.',
    price: 1650.00,
    comparePrice: 1950.00,
    category: mockCategories[3],
    collectionId: mockCollections[1],
    primaryImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Gümüş', hexCode: '#C0C0C0', stock: 4 },
      { name: 'Altın Gold', hexCode: '#D4AF37', stock: 3 },
      { name: 'Siyah Kristal', hexCode: '#191817', stock: 3 }
    ],
    material: 'Saten Kumaş & Kristal Taş İşleme',
    dimensions: { width: '20 cm', height: '12 cm', depth: '5 cm' },
    stock: 10,
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    tags: ['gece çantası', 'abiye', 'kristal', 'portföy']
  },
  {
    _id: 'prod-6',
    title: 'Lizbon Çok Bölmeli Şehir Sırt Çantası',
    slug: 'lizbon-cok-bolmeli-sehir-sirt-cantasi',
    sku: 'NC-2026-006',
    description: 'Hem sırt hem el çantası olarak kullanılabilen çift askı tasarımı. 3 ana fermuarlı bölme ve suya dayanıklı dayanıklı dış yüzey.',
    price: 1199.00,
    comparePrice: 1399.00,
    category: mockCategories[4],
    collectionId: mockCollections[0],
    primaryImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85'
    ],
    colors: [
      { name: 'Siyah', hexCode: '#191817', stock: 10 },
      { name: 'Lacivert', hexCode: '#000080', stock: 6 },
      { name: 'Gri', hexCode: '#808080', stock: 6 }
    ],
    material: 'Su İtici İmpermeabl & Suni Deri Detaylar',
    dimensions: { width: '30 cm', height: '35 cm', depth: '14 cm' },
    stock: 22,
    isFeatured: false,
    isNewArrival: false,
    status: 'active',
    tags: ['sırt çantası', 'çok bölmeli', 'fonksiyonel', 'seyahat']
  }
];
