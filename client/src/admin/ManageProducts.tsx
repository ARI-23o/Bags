import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { Product, Category, Collection } from '../types';
import { formatTRY } from '../utils/currency';
import { ProductFormModal } from './ProductFormModal';

export const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, colRes] = await Promise.all([
        api.get('/products/admin/all'),
        api.get('/categories/admin/all'),
        api.get('/collections/admin/all')
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (colRes.data.success) setCollections(colRes.data.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) return;

    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Ürün silinemedi.');
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Ürün Yönetimi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Toplam {products.length} adet çanta ve aksesuar modeli kayıtlı.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün adı, SKU veya kategori ile ara..."
          className="w-full bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white rounded-sm focus:outline-none focus:border-amber-400"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/50">
                <th className="p-4 font-semibold">Görsel & Başlık</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Fiyat</th>
                <th className="p-4 font-semibold">Stok</th>
                <th className="p-4 font-semibold">Durum</th>
                <th className="p-4 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Ürünler yükleniyor...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Arama kriterlerine uygun ürün bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.primaryImage || '/placeholder-bag.jpg'}
                          alt={product.title}
                          className="w-12 h-14 object-cover rounded bg-slate-800 border border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">
                            {product.title}
                          </span>
                          <div className="flex gap-1.5 mt-1">
                            {product.isNewArrival && (
                              <span className="px-1.5 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-800 rounded text-[10px]">
                                Yeni
                              </span>
                            )}
                            {product.isFeatured && (
                              <span className="px-1.5 py-0.5 bg-purple-950/80 text-purple-400 border border-purple-800 rounded text-[10px]">
                                Vitrin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300 font-bold">
                      {product.sku}
                    </td>
                    <td className="p-4 text-slate-300">
                      {product.category?.name || '-'}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {formatTRY(product.price)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          product.stock === 0
                            ? 'bg-red-950/80 border border-red-800 text-red-300'
                            : product.stock <= 3
                            ? 'bg-amber-950/80 border border-amber-800 text-amber-300'
                            : 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {product.stock} Adet
                      </span>
                    </td>
                    <td className="p-4">
                      {product.status === 'active' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Yayında
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Taslak
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductFormModal
          isOpen={modalOpen}
          product={editingProduct}
          categories={categories}
          collections={collections}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};
