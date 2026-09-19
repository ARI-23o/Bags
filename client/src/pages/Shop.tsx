import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, RotateCcw, Search } from 'lucide-react';
import api from '../services/api';
import { Product, Category, Collection } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get('category') || '';
  const collectionParam = searchParams.get('collection') || '';
  const searchParam = searchParams.get('search') || '';
  const isNewArrivalParam = searchParams.get('isNewArrival') === 'true';
  const isSaleParam = searchParams.get('isSale') === 'true';

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState<string>(collectionParam);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [newArrivalOnly, setNewArrivalOnly] = useState<boolean>(isNewArrivalParam);
  const [saleOnly, setSaleOnly] = useState<boolean>(isSaleParam);
  const [sortOption, setSortOption] = useState<string>('recommended');

  // Available filter options from backend
  const [availableColors, setAvailableColors] = useState<{ name: string; hexCode: string }[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedCollection(collectionParam);
    setNewArrivalOnly(isNewArrivalParam);
    setSaleOnly(isSaleParam);
  }, [categoryParam, collectionParam, isNewArrivalParam, isSaleParam]);

  // Initial metadata fetch
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          api.get('/categories'),
          api.get('/collections')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (colRes.data.success) setCollections(colRes.data.collections);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          limit: 36,
          sort: sortOption
        };

        if (selectedCategory) params.category = selectedCategory;
        if (selectedCollection) params.collection = selectedCollection;
        if (selectedColor) params.color = selectedColor;
        if (selectedMaterial) params.material = selectedMaterial;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (inStockOnly) params.inStock = true;
        if (newArrivalOnly) params.isNewArrival = true;
        if (saleOnly) params.isSale = true;
        if (searchParam) params.search = searchParam;

        const response = await api.get('/products', { params });
        if (response.data.success) {
          setProducts(response.data.products);
          setTotalCount(response.data.total);

          if (response.data.filterOptions) {
            setAvailableColors(response.data.filterOptions.colors || []);
            setAvailableMaterials(response.data.filterOptions.materials || []);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedCollection,
    selectedColor,
    selectedMaterial,
    minPrice,
    maxPrice,
    inStockOnly,
    newArrivalOnly,
    saleOnly,
    sortOption,
    searchParam
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedCollection('');
    setSelectedColor('');
    setSelectedMaterial('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setNewArrivalOnly(false);
    setSaleOnly(false);
    setSortOption('recommended');
    setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedCollection) ||
    Boolean(selectedColor) ||
    Boolean(selectedMaterial) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockOnly ||
    newArrivalOnly ||
    saleOnly ||
    Boolean(searchParam);

  const getPageTitle = () => {
    if (searchParam) return `"${searchParam}" İçin Arama Sonuçları`;
    if (newArrivalOnly) return 'Yeni Gelen Çantalar';
    if (saleOnly) return 'İndirimli Ürünler & Kampanyalar';
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory || c._id === selectedCategory);
      if (cat) return cat.name;
    }
    if (selectedCollection) {
      const col = collections.find((c) => c.slug === selectedCollection || c._id === selectedCollection);
      if (col) return col.name;
    }
    return 'Tüm Kadın Çantaları';
  };

  return (
    <>
      <SEOHelmet
        title={getPageTitle()}
        description="Nehir Çanta geniş ürün yelpazesi: Omuz çantası, baget, çapraz çanta, sırt çantası ve mini çantalar."
      />

      <div className="bg-brand-bg py-8 md:py-12 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Title */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
              NEHİR ÇANTA KOLEKSİYONU
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-brand-taupe mt-2">
              Toplam {totalCount} model listeleniyor
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Control Bar: Mobile Filter Toggle + Sorting */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-brand-border">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-primary text-xs font-semibold uppercase tracking-luxury text-brand-primary rounded-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrele {hasActiveFilters && '(Aktif)'}
          </button>

          {/* Desktop Filter Counter */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-brand-taupe">
            <span>Filtreler</span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-brand-primary font-semibold hover:text-red-500 inline-flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Temizle
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort" className="text-xs uppercase tracking-wider text-brand-taupe hidden sm:inline">
              Sırala:
            </label>
            <select
              id="shop-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-brand-bg border border-brand-border text-xs text-brand-primary py-2 px-3 focus:outline-none focus:border-brand-primary rounded-sm cursor-pointer font-medium"
            >
              <option value="recommended">Önerilen Sıralama</option>
              <option value="newest">En Yeni Modeller</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name_asc">İsim: A'dan Z'ye</option>
              <option value="name_desc">İsim: Z'den A'ya</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-8 pr-4">
            {/* Categories Filter */}
            <div className="border-b border-brand-border pb-6">
              <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
                Kategoriler
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-left w-full transition-colors ${
                      !selectedCategory ? 'font-bold text-brand-gold' : 'text-brand-charcoal hover:text-brand-primary'
                    }`}
                  >
                    Tüm Kategoriler
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left w-full flex justify-between items-center transition-colors ${
                        selectedCategory === cat.slug
                          ? 'font-bold text-brand-gold'
                          : 'text-brand-charcoal hover:text-brand-primary'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className="text-[11px] text-brand-taupe font-normal">
                          ({cat.productCount})
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-brand-border pb-6">
              <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
                Fiyat Aralığı (₺)
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 bg-brand-bg border border-brand-border px-3 py-1.5 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                />
                <span className="text-brand-taupe">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 bg-brand-bg border border-brand-border px-3 py-1.5 text-xs rounded-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Color Filter */}
            {availableColors.length > 0 && (
              <div className="border-b border-brand-border pb-6">
                <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
                  Renkler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() =>
                        setSelectedColor(selectedColor === col.name ? '' : col.name)
                      }
                      className={`px-3 py-1 text-xs rounded-sm border transition-all ${
                        selectedColor === col.name
                          ? 'bg-brand-primary text-brand-white border-brand-primary font-semibold'
                          : 'bg-brand-bg text-brand-charcoal border-brand-border hover:border-brand-taupe'
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Filter */}
            {availableMaterials.length > 0 && (
              <div className="border-b border-brand-border pb-6">
                <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
                  Materyal
                </h3>
                <ul className="space-y-2 text-xs">
                  {availableMaterials.map((mat) => (
                    <li key={mat}>
                      <button
                        onClick={() =>
                          setSelectedMaterial(selectedMaterial === mat ? '' : mat)
                        }
                        className={`text-left w-full transition-colors ${
                          selectedMaterial === mat
                            ? 'font-bold text-brand-gold'
                            : 'text-brand-charcoal hover:text-brand-primary'
                        }`}
                      >
                        {mat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Availability & Switches */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 text-xs font-medium text-brand-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-brand-primary w-4 h-4 rounded cursor-pointer"
                />
                Yalnızca Stokta Olanlar
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-brand-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrivalOnly}
                  onChange={(e) => setNewArrivalOnly(e.target.checked)}
                  className="accent-brand-primary w-4 h-4 rounded cursor-pointer"
                />
                Yeni Gelenler
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-brand-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="accent-brand-primary w-4 h-4 rounded cursor-pointer"
                />
                İndirimli Ürünler
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse space-y-3">
                    <div className="aspect-[3/4] bg-brand-cream/80 rounded-sm" />
                    <div className="h-4 bg-brand-cream/80 rounded w-3/4" />
                    <div className="h-4 bg-brand-cream/80 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-brand-cream/30 border border-brand-border rounded-sm">
                <Search className="w-12 h-12 text-brand-taupe/50 mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
                  Aradığınız Kriterlere Uygun Ürün Bulunamadı
                </h3>
                <p className="text-xs text-brand-taupe max-w-sm mx-auto mb-6">
                  Farklı filtreler seçmeyi deneyebilir veya filtreleri sıfırlayabilirsiniz.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="luxury-btn-outline inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Filtreleri Sıfırla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-4/5 max-w-sm bg-brand-bg h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 p-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                <h3 className="font-serif text-2xl font-bold uppercase tracking-luxury text-brand-primary">
                  Filtrele
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-brand-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-2">
                  Kategori
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border p-2 text-xs rounded-sm"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-2">
                  Fiyat Aralığı (₺)
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 bg-brand-bg border border-brand-border p-2 text-xs rounded-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 bg-brand-bg border border-brand-border p-2 text-xs rounded-sm"
                  />
                </div>
              </div>

              {/* Mobile Switches */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-brand-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-brand-primary w-4 h-4"
                  />
                  Yalnızca Stoktakiler
                </label>

                <label className="flex items-center gap-2 text-xs text-brand-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newArrivalOnly}
                    onChange={(e) => setNewArrivalOnly(e.target.checked)}
                    className="accent-brand-primary w-4 h-4"
                  />
                  Yeni Gelenler
                </label>

                <label className="flex items-center gap-2 text-xs text-brand-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="accent-brand-primary w-4 h-4"
                  />
                  İndirimli Ürünler
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full luxury-btn-primary"
              >
                Sonuçları Gör ({totalCount})
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full luxury-btn-outline"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
