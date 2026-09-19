# NEHİR ÇANTA — E-Ticaret ve Marka Platformu

> **NEHİR ÇANTA** (@nehircanta2016) için özel olarak tasarlanmış ve geliştirilmiş; Türk kadın çanta ve moda e-ticaret dinamiklerine uygun, lüks editoryal tasarımlı, WhatsApp sipariş entegrasyonlu ve B2B toptan satış yönetimli birinci sınıf dijital mağaza platformu.

---

## 👜 Proje Özeti & Marka Kimliği

- **Marka:** NEHİR ÇANTA (Kuruluş: 2016, İstanbul)
- **Instagram:** [@nehircanta2016](https://www.instagram.com/nehircanta2016/)
- **Tasarım Dili:** Sıcak lüks butik paleti (`#F7F4EF` krem arka plan, `#191817` kömür siyahı, `#A79A8C` vizon, `#D8C9B8` soft bej ve `#B69A67` altın vurgu)
- **Tipografi:** Başlıklar için `Cormorant Garamond` (editoryal serif) ve arayüz/metinler için `Manrope` (modern sans-serif).
- **Para Birimi:** Türk Lirası (`₺1.299,00` formatı ile tam uyumlu).

---

## 🚀 Temel Özellikler

### 1. Müşteri & Mağaza Deneyimi
- **Editoryal Ana Sayfa:** Admin yönetimli Hero slider, "Yeni Gelenler", "Kategoriye Göre Alışveriş", editoryal "Stiline Uygun Bir Model" bölümü, güven rozetleri ve dinamik Instagram akışı (@nehircanta2016).
- **Gelişmiş Filtreleme & Arama:** Türkçe karakter (`ç, ğ, ı, İ, ö, ş, ü`) destekli hızlı arama, kategori, koleksiyon, fiyat aralığı, renk, materyal ve stok durumuna göre çoklu filtreleme.
- **Lüks Ürün Kartı:** Hover ikincil görsel geçişi, renk varyant noktaları, "Yeni" / "İndirim" / "Tükendi" / "Son X Ürün" rozetleri, favori listesi ve anında Hızlı Bakış (Quick View) modalı.
- **Zengin Ürün Detay Sayfası (PDP):** Çoklu görsel zoom galerisi, renk seçimi, stok göstergesi, boyut/ölçü/materyal özellikleri ve akordeon yapılı teslimat/iade/bakım bilgileri.
- **WhatsApp Doğrudan Ticaret:**
  - Tek tıkla ürün detaylarını ve bağlantısını içeren önceden doldurulmuş Türkçe WhatsApp mesajı.
  - Sepetteki tüm ürünleri listeleyen, kargo ve genel toplamı hesaplayarak siparişi WhatsApp'a aktaran akıllı buton.
- **Türkçe Ödeme Adımları (Checkout):** 81 il ve ilçe seçimi, Havale/EFT (banka hesap detayları modalı), Kapıda Ödeme ve İndirim Kuponu uygulama desteği.
- **Canlı Sipariş Takibi:** Sipariş numarası ve telefon/e-posta ile anlık kargo durumu sorgulama.
- **B2B / Toptan Satış Sayfası:** Butik ve mağazalar için özel toptan çanta ön başvuru formu ve WhatsApp doğrudan B2B iletişim kanalı.
- **Mevzuata Uygunluk & Çerez Yönetimi:** KVKK Aydınlatma Metni, Mesafeli Satış Sözleşmesi, Çerez Politikası ve tercihleri yönetilebilir Çerez Bildirim bandı.

### 2. Kapsamlı Yönetim Paneli (/admin)
- **Güvenli Yönetici Girişi:** JWT & HTTP-Only çerez oturum yönetimi, şifreli kimlik doğrulama.
- **Dashboard & Analitik:** Toplam sipariş, ciro, bekleyen siparişler, aktif ürün sayısı ve kritik stok uyarıları tablosu.
- **Ürün Yönetimi (CRUD):** Yeni çanta ekleme, çoklu görsel yükleme, renk varyantları tanımlama, stok adedi, fiyat/üstü çizili fiyat, ölçü ve materyal yönetimi.
- **Sipariş İşleme Pipeline:** Beklemede ➔ Onaylandı ➔ Hazırlanıyor ➔ Kargoya Verildi ➔ Teslim Edildi iş akışı, kargo takip kodu girişi ve yazdırılabilir sipariş fişi.
- **Kategori & Koleksiyon CMS:** Dinamik kategori ve özel sezonluk koleksiyon tanımlama.
- **Toptan Satış Başvuruları:** Gelen B2B başvurularını inceleme, durum güncelleme ve tek tıkla müşteriye WhatsApp üzerinden ulaşma.
- **Kupon & İndirim Yönetimi:** Yüzdelik veya sabit tutarlı, minimum sepet tutarlı kupon oluşturma.
- **Yorum Moderasyonu:** Gelen müşteri değerlendirmelerini onaylama/reddetme.
- **Dinamik Mağaza Ayarları:** WhatsApp numarası, marka bilgileri, kargo ücreti, ücretsiz kargo eşiği, banka IBAN bilgileri ve duyuru bandı yönetimi.
- **Güvenlik & Audit Logs:** Yöneticilerin yaptığı tüm işlemleri kaydeden ve listeleyen denetim günlüğü.

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Hızlı, tip güvenli modern frontend mimarisi |
| **Styling** | Tailwind CSS | Özel lüks marka paleti ve editoryal tipografi |
| **Animasyonlar** | Framer Motion | Zarif ve akıcı geçişler |
| **İkonlar** | Lucide React | Modern ve temiz ikon seti |
| **Routing & SEO** | React Router v6 + React Helmet Async | Türkçe URL rotaları, OpenGraph ve JSON-LD şemaları |
| **Backend** | Node.js + Express (ES Modules) | RESTful API mimarisi |
| **Veritabanı** | PostgreSQL 18 (`pg` pool + relational schema) | Güçlü ilişkisel ve JSONB destekli veritabanı |
| **Güvenlik** | Helmet, CORS, Rate-Limit, bcrypt, JWT | Üretim düzeyinde API güvenliği |
| **Medya** | Multer & Cloudinary entegrasyonu | Optimize görsel yönetimi |
| **Test** | Vitest | Kapsamlı birim ve entegrasyon testleri |
| **CI/CD** | GitHub Actions | Otomatik test, doğrulama ve derleme boru hattı |

---

## 📁 Proje Dizin Yapısı

```
bags/
├── .github/
│   └── workflows/
│       └── ci.yml               # Otomatik test ve derleme pipeline'ı
├── client/                      # React + TypeScript Frontend
│   ├── public/                  # Favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── admin/               # Yönetim Paneli Sayfa ve Bileşenleri
│   │   ├── components/          # Ortak, Navigasyon, Ürün, Sepet ve Ana Sayfa Bileşenleri
│   │   ├── context/             # Sepet, Favori, Ayarlar ve Yetkilendirme Context'leri
│   │   ├── pages/               # Mağaza Sayfaları (Home, Shop, PDP, Cart, Checkout, vb.)
│   │   ├── services/            # Axios API istemcisi
│   │   ├── types/               # TypeScript Arayüzleri
│   │   ├── utils/               # Para Birimi ve WhatsApp Link Formatlayıcıları
│   │   ├── App.tsx              # Ana Rota Yapılandırması
│   │   └── main.tsx             # React Kök Girişi
│   └── tests/                   # Frontend Birim Testleri
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB Bağlantısı
│   │   ├── controllers/         # Ürün, Sipariş, Toptan, Kupon vb. Controller'lar
│   │   ├── middleware/          # JWT Yetkilendirme, Hata Yakalama, Upload ve Audit Logger
│   │   ├── models/              # Mongoose Şemaları (Product, Order, Category vb.)
│   │   ├── routes/              # Express API Rotaları
│   │   ├── scripts/             # Veritabanı Doldurma (seed.js)
│   │   ├── utils/               # Türkçe Slugify ve Arama Yardımcıları
│   │   └── server.js            # Express Sunucu Girişi
│   └── tests/                   # Backend Birim Testleri
└── package.json                 # Kök Orkestrasyon Yapılandırması
```

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js (v18+)
- MongoDB (Yerel MongoDB servisi veya MongoDB Atlas bağlantısı)

### 2. Bağımlılıkları Yükleme
```bash
# Proje kök dizininde bağımlılıkları yükleyin
npm install

# İstemci ve sunucu bağımlılıklarını yükleyin
cd server && npm install
cd ../client && npm install
```

### 3. Çevre Değişkenleri (.env)
`server/.env.example` dosyasını kopyalayarak `server/.env` oluşturun:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nehircanta
JWT_SECRET=super_secret_jwt_key_nehir_canta_2026
CLIENT_URL=http://localhost:5173
DEFAULT_WHATSAPP_NUMBER=905320000000
```

### 4. Örnek Veritabanını Doldurma (Seed)
Gerçekçi Türkçe çanta modelleri, kategoriler, koleksiyonlar, hero slaytları, Instagram vitrini ve yönetici hesabı oluşturmak için:
```bash
cd server
npm run seed
```

> **Örnek Yönetici Giriş Bilgileri:**
> - **E-Posta:** `admin@nehircanta.com`
> - **Şifre:** `admin123456`
> - **Yönetim Paneli:** `http://localhost:5173/admin/login`

### 5. Uygulamayı Başlatma
```bash
# Kök dizinden hem sunucu hem istemciyi aynı anda başlatın:
npm run dev

# Veya ayrı ayrı çalıştırmak için:
npm run dev:server  # Port: 5000
npm run dev:client  # Port: 5173
```

---

## 🧪 Testleri Çalıştırma

```bash
# Tüm testleri çalıştırma (Frontend + Backend)
npm test

# Sadece backend testleri:
npm run test:server

# Sadece frontend testleri:
npm run test:client
```

---

## 📦 Canlıya Alma (Production Deployment)

1. **Frontend (Vercel / Netlify):**
   - Build komutu: `npm run build`
   - Çıktı dizini: `dist`
   - Ortam Değişkeni: `VITE_API_URL=https://your-api-domain.com/api`

2. **Backend (Render / Railway / VPS):**
   - Başlatma komutu: `npm start`
   - Ortam Değişkenleri: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`

---

## 📄 Lisans ve Telif
Bu platform **NEHİR ÇANTA** ticari markası için özel olarak hazırlanmıştır.
Tüm hakları saklıdır © 2026.
