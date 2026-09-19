import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';
import { Collection } from '../types';

export const ManageCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/collections/admin/all');
      if (response.data.success) {
        setCollections(response.data.collections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/collections/${editingId}`, { name, subtitle, description, image });
      } else {
        await api.post('/collections', { name, subtitle, description, image });
      }
      setName('');
      setSubtitle('');
      setDescription('');
      setImage('');
      setEditingId(null);
      fetchCollections();
    } catch (err: any) {
      alert(err.message || 'Hata oluştu.');
    }
  };

  const handleEdit = (col: Collection) => {
    setEditingId(col._id);
    setName(col.name);
    setSubtitle(col.subtitle || '');
    setDescription(col.description || '');
    setImage(col.image || '');
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!window.confirm(`"${colName}" koleksiyonunu silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/collections/${id}`);
      fetchCollections();
    } catch (err: any) {
      alert(err.message || 'Silinemedi.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Koleksiyon Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">
          Sezonluk ve tematik çanta koleksiyonlarını oluşturun ve düzenleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-white">
            {editingId ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon Ekle'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Koleksiyon Adı *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: 2026 İlkbahar / Yaz"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Alt Başlık / Spot
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Örn: Canlı tonlar ve hafif dokular"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Açıklama
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Koleksiyon açıklaması..."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Kapak Görsel URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setSubtitle('');
                    setDescription('');
                    setImage('');
                  }}
                  className="px-4 py-2 border border-slate-700 text-slate-300 rounded"
                >
                  İptal
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded transition-colors"
              >
                {editingId ? 'Güncelle' : 'Koleksiyon Ekle'}
              </button>
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Görsel</th>
                <th className="p-4">Koleksiyon Adı</th>
                <th className="p-4">Alt Başlık</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Kayıtlı koleksiyon bulunamadı.
                  </td>
                </tr>
              ) : (
                collections.map((col) => (
                  <tr key={col._id} className="hover:bg-slate-800/40">
                    <td className="p-4">
                      {col.image ? (
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-10 h-10 object-cover rounded bg-slate-800 border border-slate-700"
                        />
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-white">{col.name}</td>
                    <td className="p-4 text-slate-400">{col.subtitle || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(col)}
                          className="p-1.5 text-slate-400 hover:text-amber-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(col._id, col.name)}
                          className="p-1.5 text-slate-400 hover:text-red-400"
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
    </div>
  );
};
