import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { Product, Category, Collection, ColorVariant } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  collections: Collection[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  categories,
  collections,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<any>({
    title: '',
    sku: '',
    category: categories[0]?._id || '',
    collectionId: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    stock: 10,
    primaryImage: '',
    secondaryImage: '',
    images: [''],
    colors: [{ name: 'Siyah', hexCode: '#191817', stock: 10 }],
    material: 'Premium Vegan Deri',
    dimensions: { width: '28 cm', height: '18 cm', depth: '8 cm' },
    strapType: 'Ayarlanabilir Deri Askı',
    closure: 'Fermuarlı',
    interiorDetails: 'Astarlı ana bölme ve fermuarlı iç cep',
    careInstructions: 'Nemli bir bezle silinmesi önerilir.',
    shortDescription: '',
    description: '',
    isNewArrival: true,
    isFeatured: false,
    isSale: false,
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        sku: product.sku || '',
        category: product.category?._id || product.category || categories[0]?._id || '',
        collectionId: product.collectionId?._id || product.collectionId || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        costPrice: product.costPrice || '',
        stock: product.stock ?? 10,
        primaryImage: product.primaryImage || '',
        secondaryImage: product.secondaryImage || '',
        images: product.images && product.images.length > 0 ? product.images : [''],
        colors:
          product.colors && product.colors.length > 0
            ? product.colors
            : [{ name: 'Siyah', hexCode: '#191817', stock: 10 }],
        material: product.material || '',
        dimensions: product.dimensions || { width: '', height: '', depth: '' },
        strapType: product.strapType || '',
        closure: product.closure || '',
        interiorDetails: product.interiorDetails || '',
        careInstructions: product.careInstructions || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        isNewArrival: product.isNewArrival ?? false,
        isFeatured: product.isFeatured ?? false,
        isSale: product.isSale ?? false,
        status: product.status || 'active'
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleDimensionChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value }
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev: any) => ({
      ...prev,
      images: updated,
      primaryImage: updated[0] || prev.primaryImage
    }));
  };

  const addImageField = () => {
    setFormData((prev: any) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const updated = formData.images.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, images: updated.length ? updated : [''] }));
  };

  const handleColorChange = (index: number, field: keyof ColorVariant, value: any) => {
    const updated = [...formData.colors];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, colors: updated }));
  };

  const addColorField = () => {
    setFormData((prev: any) => ({
      ...prev,
      colors: [...prev.colors, { name: '', hexCode: '#000000', stock: 5 }]
    }));
  };

  const removeColorField = (index: number) => {
    const updated = formData.colors.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, colors: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.sku.trim() || !formData.price) {
      setError('Lütfen zorunlu alanları (Başlık, SKU, Fiyat) doldurunuz.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanedImages = formData.images.filter((img: string) => img.trim().length > 0);
      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
        stock: Number(formData.stock),
        images: cleanedImages,
        primaryImage: cleanedImages[0] || formData.primaryImage || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        secondaryImage: cleanedImages[1] || formData.secondaryImage || ''
      };

      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-800 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              {product ? 'Ürünü Düzenle' : 'Yeni Çanta Modeli Ekle'}
            </h2>
            <span className="text-xs text-slate-400">
              Ürün bilgileri, renk varyantları ve görsellerini yönetin.
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Ürün Başlığı *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Siyah Kapitone Omuz Çantası"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                SKU / Ürün Kodu *
              </label>
              <input
                type="text"
                required
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Örn: NC-OMZ-001"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Koleksiyon (Opsiyonel)
              </label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="">Seçilmedi</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Yayın Durumu
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="active">Yayında (Aktif)</option>
                <option value="draft">Taslak (Gizli)</option>
                <option value="archived">Arşivlendi</option>
              </select>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-sm">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Satış Fiyatı (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1299.90"
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Üstü Çizili Fiyat (₺)
              </label>
              <input
                type="number"
                step="0.01"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                placeholder="1599.90"
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Maliyet Fiyatı (₺)
              </label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="500.00"
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Toplam Stok Adedi *
              </label>
              <input
                type="number"
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-sm focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>
          </div>

          {/* Section 3: Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-300">
                Görsel URL Listesi (Cloudinary / Doğrudan Bağlantı)
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-amber-400 hover:underline flex items-center gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Görsel Ekle
              </button>
            </div>

            {formData.images.map((imgUrl: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`Görsel URL ${idx + 1}`}
                  className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Section 4: Color Variants */}
          <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-sm">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-slate-300">
                Renk Varyantları & Stokları
              </label>
              <button
                type="button"
                onClick={addColorField}
                className="text-amber-400 hover:underline flex items-center gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Renk Ekle
              </button>
            </div>

            {formData.colors.map((c: ColorVariant, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                  placeholder="Renk Adı (Örn: Siyah)"
                  className="w-1/3 bg-slate-900 border border-slate-800 p-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
                <input
                  type="color"
                  value={c.hexCode || '#000000'}
                  onChange={(e) => handleColorChange(idx, 'hexCode', e.target.value)}
                  className="w-10 h-8 bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="number"
                  value={c.stock}
                  onChange={(e) => handleColorChange(idx, 'stock', Number(e.target.value))}
                  placeholder="Stok"
                  className="w-24 bg-slate-900 border border-slate-800 p-2 rounded-sm focus:outline-none focus:border-amber-400"
                />
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColorField(idx)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Section 5: Specs & Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Materyal
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Örn: Premium Vegan Deri"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Ölçüler (En x Boy x Derinlik)
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={formData.dimensions?.width || ''}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  placeholder="En: 28cm"
                  className="w-1/3 bg-slate-950 border border-slate-800 p-2 rounded-sm"
                />
                <input
                  type="text"
                  value={formData.dimensions?.height || ''}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  placeholder="Boy: 18cm"
                  className="w-1/3 bg-slate-950 border border-slate-800 p-2 rounded-sm"
                />
                <input
                  type="text"
                  value={formData.dimensions?.depth || ''}
                  onChange={(e) => handleDimensionChange('depth', e.target.value)}
                  placeholder="Derinlik: 8cm"
                  className="w-1/3 bg-slate-950 border border-slate-800 p-2 rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Askı Türü
              </label>
              <input
                type="text"
                name="strapType"
                value={formData.strapType}
                onChange={handleChange}
                placeholder="Örn: Ayarlanabilir Deri Askı"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Kısa Açıklama (Spot Metin)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Özel kapitone dikişli, altın rengi zincir askılı lüks omuz çantası."
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Detaylı Ürün Açıklaması
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Ürünün kumaş özellikleri, kullanım alanları ve tasarım detayları..."
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded-sm"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="accent-amber-400 w-4 h-4"
              />
              <span className="font-semibold text-slate-200">Yeni Gelenler Etiketi</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="accent-amber-400 w-4 h-4"
              />
              <span className="font-semibold text-slate-200">Vitrin / Favori Koleksiyon</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isSale"
                checked={formData.isSale}
                onChange={handleChange}
                className="accent-amber-400 w-4 h-4"
              />
              <span className="font-semibold text-slate-200">İndirim / Kampanya Etiketi</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-700 text-slate-300 hover:text-white rounded-sm"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded-sm"
            >
              {loading ? 'Kaydediliyor...' : product ? 'Güncelle' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
