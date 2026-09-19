import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, query } from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed] PostgreSQL veritabanına bağlanılıyor...');
    await connectDB();
    console.log('[Seed] Bağlantı başarılı.');

    // Clear existing data
    console.log('[Seed] Eski veriler temizleniyor...');
    await query('TRUNCATE TABLE reviews, audit_logs, contact_messages, wholesale_enquiries, orders, products, collections, categories, coupons, instagram_posts, hero_slides, site_settings, admins, users CASCADE');

    // 1. Create Super Admin
    console.log('[Seed] Yönetici hesabı oluşturuluyor...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);
    const adminRes = await query(
      `INSERT INTO admins (name, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      ['Nehir Çanta Yönetici', 'admin@nehircanta.com', hashedPassword, 'super_admin', true]
    );
    console.log(`[Seed] Yönetici oluşturuldu: ${adminRes.rows[0].email} (Şifre: admin123456)`);

    // 2. Create Site Settings
    console.log('[Seed] Mağaza ayarları yapılandırılıyor...');
    await query(
      `INSERT INTO site_settings (
        brand_name, tagline, phone, whatsapp_number, email, address, opening_hours,
        instagram_url, currency, shipping_settings, payment_methods, bank_accounts,
        announcement_bar, trust_badges, legal_policies
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        'NEHİR ÇANTA',
        'Zarafetin ve Tarzın Buluşma Noktası',
        '+90 532 000 00 00',
        '905320000000',
        'info@nehircanta.com',
        'Nişantaşı, Teşvikiye Cad. No:42, Şişli / İstanbul',
        'Pazartesi - Cumartesi: 09:30 - 19:30',
        'https://www.instagram.com/nehircanta2016/',
        JSON.stringify({ code: 'TRY', symbol: '₺' }),
        JSON.stringify({
          standardRate: 79.90,
          freeShippingThreshold: 1000,
          isFreeShippingEnabled: true,
          estimatedDeliveryDays: '2 - 4 İş Günü'
        }),
        JSON.stringify({
          havaleEftEnabled: true,
          kapidaOdemeEnabled: true,
          kapidaOdemeFee: 29.90,
          creditCardEnabled: false
        }),
        JSON.stringify([{
          bankName: 'Ziraat Bankası',
          accountHolder: 'Nehir Çanta Tic. Ltd. Şti.',
          iban: 'TR12 0001 0000 1234 5678 9012 34',
          branchCode: 'Kadıköy Şubesi (1234)'
        }]),
        JSON.stringify({
          isEnabled: true,
          text: 'Yeni Sezon Kadın Çanta Koleksiyonumuz Yayında! 1000 TL Üzeri Siparişlerde Kargo Bedava.',
          link: '/shop'
        }),
        JSON.stringify({
          badge1Title: 'Özenli Paketleme',
          badge1Subtitle: 'Her çanta özel koruyucu kılıfı ile özenle paketlenir.',
          badge2Title: 'Güvenli Alışveriş',
          badge2Subtitle: 'Banka Havalesi / EFT ve Kapıda Ödeme imkanı.',
          badge3Title: 'Hızlı İletişim',
          badge3Subtitle: 'WhatsApp destek hattımızdan anında bilgi alabilirsiniz.',
          badge4Title: 'Seçkin Kalite',
          badge4Subtitle: 'Kusursuz dikiş ve seçkin malzeme kalitesi.'
        }),
        JSON.stringify({})
      ]
    );

    // 3. Create Categories
    console.log('[Seed] Kategoriler ekleniyor...');
    const catOmuz = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Omuz Çantaları', 'omuz-cantalari', 'Günlük hayatınızda hem şıklığı hem konforu bir arada sunan zarif omuz çantaları.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 1]
    )).rows[0].id;

    const catCapraz = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Çapraz Çantalar', 'capraz-cantalar', 'Ellerinizi özgür bırakan, fonksiyonel ve modern tasarımlı çapraz askılı modeller.', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80', 2]
    )).rows[0].id;

    const catEl = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['El Çantaları', 'el-cantalari', 'İş yaşamından özel davetlere her anınıza değer katan elegan el çantaları.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', 3]
    )).rows[0].id;

    const catAbiye = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Abiye & Gece Çantaları', 'abiye-gece-cantalari', 'Özel gecelerinizde zarafetinizi tamamlayacak ışıltılı ve şık portföyler.', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80', 4]
    )).rows[0].id;

    const catSirt = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Sırt Çantaları', 'sirt-cantalari', 'Günün dinamizmine ayak uyduran şık ve konforlu kadın sırt çantaları.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 5]
    )).rows[0].id;

    const catBaget = (await query(
      `INSERT INTO categories (name, slug, description, image, order_index)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Baget Çantalar', 'baget-cantalar', 'Trendleri yakalayan ikonik 90lar esintili baget çanta modelleri.', 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80', 6]
    )).rows[0].id;

    // 4. Create Collections
    console.log('[Seed] Koleksiyonlar ekleniyor...');
    const colSehir = (await query(
      `INSERT INTO collections (name, slug, subtitle, description, banner_image, is_featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['Şehirli Şıklık 2026', 'sehirli-siklik-2026', 'Metropol Yaşamına Uyum Sağlayan Modern Tasarımlar', 'Günün temposunda hem ofiste hem sosyal hayatta stilinizi yansıtan zamansız parçalar.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80', true, 1]
    )).rows[0].id;

    const colGece = (await query(
      `INSERT INTO collections (name, slug, subtitle, description, banner_image, is_featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      ['Gece & Davet Koleksiyonu', 'gece-davet-koleksiyonu', 'Göz Alıcı Işıltı ve Elegan Dokunuşlar', 'Düğün, davet ve özel akşam yemeklerinde şıklığınızın başrolü olacak tasarımlar.', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1600&q=80', true, 2]
    )).rows[0].id;

    // 5. Create Hero Slides
    console.log('[Seed] Hero slaytları ekleniyor...');
    await query(
      `INSERT INTO hero_slides (title, subtitle, tagline, image, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, order_index)
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, 1),
       ($9, $10, $11, $12, $13, $14, $15, $16, 2)`,
      [
        'Yeni Sezon Zarafeti',
        'Zamansız Tasarımlar, Kusursuz Detaylar',
        '2026 İLKBAHAR / YAZ KOLEKSİYONU',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
        'Koleksiyonu Keşfet',
        '/shop',
        'Yeni Gelenler',
        '/yeni-gelenler',

        'İtalyan Dokusu & Şehir Şıklığı',
        'Modern Kadının Vazgeçilmez Aksesuarı',
        'ÖZEL İŞÇİLİK & SEÇKİN DETAYLAR',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1920&q=85',
        'Tüm Çantalar',
        '/shop',
        'Toptan Satış',
        '/toptan'
      ]
    );

    // 6. Create Instagram Posts
    console.log('[Seed] Instagram gönderileri ekleniyor...');
    await query(
      `INSERT INTO instagram_posts (caption, media_url, permalink, like_count, order_index)
       VALUES
       ($1, $2, $3, $4, 1),
       ($5, $6, $7, $8, 2),
       ($9, $10, $11, $12, 3),
       ($13, $14, $15, $16, 4),
       ($17, $18, $19, $20, 5),
       ($21, $22, $23, $24, 6)`,
      [
        'Venedik Kapitone çantamızla günün kombin ilhamı ✨ @nehircanta2016',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        245,

        'Siyah ve altının zamansız uyumu. Özel kilit detayı ile Milano modelimiz.',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        189,

        '90lar nostaljisi: Paris Vintage Baget. Hafifliğiyle gün boyu konfor.',
        'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        312,

        'Özel davetlerin gözdesi: Kristal işlemeli Monaco portföy 💫',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        420,

        'Hafta sonu gezileri için eller serbest: Floransa Mini Crossbody',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        156,

        'Ofis ve şehir temposunda yanınızda: Lizbon Çok Bölmeli Sırt Çantası',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        'https://www.instagram.com/nehircanta2016/',
        278
      ]
    );

    // 7. Create Coupons
    console.log('[Seed] İndirim kuponları ekleniyor...');
    await query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_spend, is_active)
       VALUES
       ('NEHIR10', 'percentage', 10.00, 500.00, true),
       ('HOSGELDIN100', 'fixed', 100.00, 1000.00, true)`
    );

    // 8. Create Products
    console.log('[Seed] Ürünler ekleniyor...');
    const productsData = [
      {
        title: 'Venedik Kapitone Zincirli Omuz Çantası',
        slug: 'venedik-kapitone-zincirli-omuz-cantasi',
        sku: 'NC-2026-001',
        category_id: catOmuz,
        collection_id: colSehir,
        price: 1299.00,
        compare_price: 1599.00,
        cost_price: 600.00,
        stock: 24,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Siyah', hexCode: '#191817', stock: 10 },
          { name: 'Vizon', hexCode: '#A79A8C', stock: 8 },
          { name: 'Krem', hexCode: '#F4EFEA', stock: 6 }
        ],
        short_description: 'Kapitone dikiş detaylı, altın zincir askılı lüks omuz çantası.',
        description: 'Lüks kapitone dikiş detayları, altın tonlu metal zincir askısı ve yumuşak dokusu ile hem gündüz hem gece kullanımına uygun zarif omuz çantası. İçerisinde fermuarlı güvenlik cebi ve telefon bölmesi bulunmaktadır.',
        material: 'Birinci Sınıf Vegan Deri',
        dimensions: { width: '28 cm', height: '18 cm', depth: '8 cm' },
        strap_type: 'Ayarlanabilir Altın Zincir / Deri Omuzluk',
        closure: 'Manyetik Çıtçıt & Fermuarlı Ara Bölme',
        interior_details: '1 Fermuarlı İç Cep, 2 Açık Telefon Bölmesi, Lüks Astar',
        care_instructions: 'Nemli ve yumuşak bir bezle siliniz. Kimyasal temizleyicilerden ve doğrudan güneş ışığından uzak tutunuz.',
        tags: ['omuz çantası', 'kapitone', 'altın zincir', 'lüks', 'trend'],
        is_new_arrival: true,
        is_featured: true,
        is_sale: true,
        status: 'active',
        discount_percentage: 19,
        stock_status: 'in_stock'
      },
      {
        title: 'Milano Klasik Kilitli El ve Kol Çantası',
        slug: 'milano-klasik-kilitli-el-ve-kol-cantasi',
        sku: 'NC-2026-002',
        category_id: catEl,
        collection_id: colSehir,
        price: 1450.00,
        compare_price: 1750.00,
        cost_price: 700.00,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Taba', hexCode: '#8B4513', stock: 6 },
          { name: 'Siyah', hexCode: '#191817', stock: 5 },
          { name: 'Bordo', hexCode: '#6B1D2F', stock: 4 }
        ],
        short_description: 'Sert gövde formlu, metal kilit detaylı elegan el çantası.',
        description: 'Sert gövde formu, metal kilit detayı ve çıkarılabilir uzun omuz askısı ile iş kadınlarının ve zarif stillerin vazgeçilmez modeli. Geniş iç hacmiyle tablet ve günlük ihtiyaçlarınızı rahatlıkla taşır.',
        material: 'Dokulu Suni Deri',
        dimensions: { width: '32 cm', height: '24 cm', depth: '12 cm' },
        strap_type: 'Sabit Çift El Sapı + Çıkarılabilir Uzun Deri Askı',
        closure: 'Döner Metal Toka Kilit',
        interior_details: 'Fermuarlı Orta Bölme, Gizli Kartlık Cebi',
        care_instructions: 'Kullanılmadığında formunu koruması için içi dolgulu olarak saklayınız.',
        tags: ['el çantası', 'iş çantası', 'taba', 'kilitli'],
        is_new_arrival: true,
        is_featured: true,
        is_sale: true,
        status: 'active',
        discount_percentage: 17,
        stock_status: 'in_stock'
      },
      {
        title: 'Paris Vintage Baget Çanta',
        slug: 'paris-vintage-baget-canta',
        sku: 'NC-2026-003',
        category_id: catBaget,
        collection_id: colSehir,
        price: 899.00,
        compare_price: 1099.00,
        cost_price: 400.00,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Açık Bej', hexCode: '#E6D7C3', stock: 12 },
          { name: 'Siyah', hexCode: '#191817', stock: 10 },
          { name: 'Zeytin Yeşili', hexCode: '#556B2F', stock: 8 }
        ],
        short_description: 'Minimalist 90lar nostaljisi baget kol çantası.',
        description: '90lar silüetinin en trend yorumu. Kısa kol askısı ve minimal hatları ile stilinizi anında yükselten hafif ve kompakt tasarım.',
        material: 'Pürüzsüz Vegan Deri',
        dimensions: { width: '26 cm', height: '14 cm', depth: '6 cm' },
        strap_type: 'Kısa Kol Askısı',
        closure: 'Fermuarlı Üst Kapama',
        interior_details: 'Tek Geniş Ana Bölme, Fermuarlı İç Cep',
        care_instructions: 'Yumuşak bezle tozu alınız.',
        tags: ['baget', 'vintage', 'bej', 'omuz çantası'],
        is_new_arrival: false,
        is_featured: true,
        is_sale: true,
        status: 'active',
        discount_percentage: 18,
        stock_status: 'in_stock'
      },
      {
        title: 'Floransa Mini Çapraz Kutu Çanta',
        slug: 'floransa-mini-capraz-kutu-canta',
        sku: 'NC-2026-004',
        category_id: catCapraz,
        collection_id: colSehir,
        price: 799.00,
        compare_price: 950.00,
        cost_price: 350.00,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Haki', hexCode: '#556B2F', stock: 7 },
          { name: 'Hardal', hexCode: '#DAA520', stock: 5 },
          { name: 'Siyah', hexCode: '#191817', stock: 6 }
        ],
        short_description: 'Günlük pratik kullanım için eller serbest mini çapraz çanta.',
        description: 'Ayarlanabilir çapraz askısı, hafif yapısı ve şık metal tokası ile günlük gezilerde eller serbest konfor sağlar.',
        material: 'Yumuşak Dokulu Suni Deri',
        dimensions: { width: '22 cm', height: '16 cm', depth: '7 cm' },
        strap_type: 'Ayarlanabilir Uzun Deri Askı',
        closure: 'Manyetik Çıtçıt Kapak',
        interior_details: '2 Bölmeli İç Düzen, Telefon Cebi',
        care_instructions: 'Nemli bez ile temizleyiniz.',
        tags: ['çapraz çanta', 'mini çanta', 'günlük'],
        is_new_arrival: true,
        is_featured: false,
        is_sale: false,
        status: 'active',
        discount_percentage: 0,
        stock_status: 'in_stock'
      },
      {
        title: 'Monaco Kristal Taşlı Abiye Portföy Çanta',
        slug: 'monaco-kristal-tasli-abiye-portfoy-canta',
        sku: 'NC-2026-005',
        category_id: catAbiye,
        collection_id: colGece,
        price: 1650.00,
        compare_price: 1950.00,
        cost_price: 800.00,
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Gümüş', hexCode: '#C0C0C0', stock: 4 },
          { name: 'Altın Gold', hexCode: '#D4AF37', stock: 3 },
          { name: 'Siyah Kristal', hexCode: '#191817', stock: 3 }
        ],
        short_description: 'Davet ve düğünler için göz alıcı kristal taşlı portföy.',
        description: 'Özel düğün, nişan ve davet gecelerinde tüm gözleri üzerinize çekecek ışıltılı kristal taş işlemeleri ve çıkarılabilir ince altın zincir askısı.',
        material: 'Saten Kumaş & Kristal Taş İşleme',
        dimensions: { width: '20 cm', height: '12 cm', depth: '5 cm' },
        strap_type: 'Çıkarılabilir İnce Metal Yılan Zincir',
        closure: 'Üstten Basmalı Taşlı Metal Klips',
        interior_details: 'Saten Astar, Küçük Makyaj Aynası Cebi',
        care_instructions: 'Taşların zarar görmemesi için sert sürtünmelerden koruyunuz.',
        tags: ['gece çantası', 'abiye', 'kristal', 'portföy'],
        is_new_arrival: true,
        is_featured: true,
        is_sale: true,
        status: 'active',
        discount_percentage: 15,
        stock_status: 'in_stock'
      },
      {
        title: 'Lizbon Çok Bölmeli Şehir Sırt Çantası',
        slug: 'lizbon-cok-bolmeli-sehir-sirt-cantasi',
        sku: 'NC-2026-006',
        category_id: catSirt,
        collection_id: colSehir,
        price: 1199.00,
        compare_price: 1399.00,
        cost_price: 550.00,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85'
        ],
        primary_image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
        secondary_image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
        colors: [
          { name: 'Siyah', hexCode: '#191817', stock: 10 },
          { name: 'Lacivert', hexCode: '#000080', stock: 6 },
          { name: 'Gri', hexCode: '#808080', stock: 6 }
        ],
        short_description: '3 fermuarlı ana bölmeli ergonomik kadın sırt çantası.',
        description: 'Hem sırt hem el çantası olarak kullanılabilen çift askı tasarımı. 3 ana fermuarlı bölme ve suya dayanıklı dayanıklı dış yüzey.',
        material: 'Su İtici İmpermeabl & Suni Deri Detaylar',
        dimensions: { width: '30 cm', height: '35 cm', depth: '14 cm' },
        strap_type: 'Destekli Ayarlanabilir Sırt Askıları + Üst Taşıma Sapı',
        closure: 'Çift Başlıklı Dayanıklı Metal Fermuar',
        interior_details: '13 inç Laptop/Tablet Bölmesi, Suluk Yan Cepleri, Arka Hırsızlık Önleyici Gizli Cep',
        care_instructions: 'Ilık sabunlu bezle siliniz, makinede yıkamayınız.',
        tags: ['sırt çantası', 'çok bölmeli', 'fonksiyonel', 'seyahat'],
        is_new_arrival: false,
        is_featured: false,
        is_sale: true,
        status: 'active',
        discount_percentage: 14,
        stock_status: 'in_stock'
      }
    ];

    for (const p of productsData) {
      await query(
        `INSERT INTO products (
          title, slug, sku, category_id, collection_id, price, compare_price, cost_price,
          stock, images, primary_image, secondary_image, colors, short_description,
          description, material, dimensions, strap_type, closure, interior_details,
          care_instructions, tags, is_new_arrival, is_featured, is_sale, status,
          discount_percentage, stock_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26,
          $27, $28
        )`,
        [
          p.title,
          p.slug,
          p.sku,
          p.category_id,
          p.collection_id,
          p.price,
          p.compare_price,
          p.cost_price,
          p.stock,
          JSON.stringify(p.images),
          p.primary_image,
          p.secondary_image,
          JSON.stringify(p.colors),
          p.short_description,
          p.description,
          p.material,
          JSON.stringify(p.dimensions),
          p.strap_type,
          p.closure,
          p.interior_details,
          p.care_instructions,
          JSON.stringify(p.tags),
          p.is_new_arrival,
          p.is_featured,
          p.is_sale,
          p.status,
          p.discount_percentage,
          p.stock_status
        ]
      );
    }

    console.log(`[Seed] Toplam ${productsData.length} ürün başarıyla eklendi.`);
    console.log('[Seed] PostgreSQL Tohumlama işlemi tamamlandı! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Hata oluştu: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
