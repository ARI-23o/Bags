import React, { useEffect, useState } from 'react';
import { Instagram, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { InstagramPost } from '../types';

export const ManageInstagram: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [permalink, setPermalink] = useState('https://www.instagram.com/nehircanta2016/');
  const [likes, setLikes] = useState<number | ''>('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/instagram/admin/all');
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    try {
      await api.post('/instagram', {
        mediaUrl,
        caption,
        permalink,
        likes: Number(likes) || 0,
        isActive: true
      });

      setMediaUrl('');
      setCaption('');
      setLikes('');
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Gönderi eklenemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu Instagram gönderisini silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/instagram/${id}`);
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Silinemedi.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Instagram Vitrin Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">
          Ana sayfada "@nehircanta2016" başlığı altında gösterilen fotoğrafları yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Instagram className="w-5 h-5 text-amber-400" /> Yeni Gönderi Ekle
          </h2>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Görsel URL *
              </label>
              <input
                type="text"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash..."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Açıklama / Başlık
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Günün kombini: Siyah Kapitone Omuz Çantası ✨"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Instagram Linki (Permalink)
              </label>
              <input
                type="text"
                value={permalink}
                onChange={(e) => setPermalink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Beğeni Sayısı (Görsel amaçlı)
              </label>
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="350"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded transition-colors text-xs"
            >
              Gönderiyi Ekle
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-xs text-slate-500 col-span-3">Yükleniyor...</p>
          ) : posts.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-3">Kayıtlı gönderi bulunamadı.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="group relative aspect-square bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption || 'Instagram'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <p className="text-[11px] text-white line-clamp-3">{post.caption}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
