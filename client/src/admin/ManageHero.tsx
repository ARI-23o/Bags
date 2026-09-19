import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Sliders } from 'lucide-react';
import api from '../services/api';
import { HeroSlide } from '../types';

export const ManageHero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [image, setImage] = useState('');
  const [ctaPrimaryText, setCtaPrimaryText] = useState('KOLEKSİYONU KEŞFET');
  const [ctaPrimaryLink, setCtaPrimaryLink] = useState('/shop');

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hero/admin/all');
      if (response.data.success) {
        setSlides(response.data.slides);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    try {
      await api.post('/hero', {
        title,
        subtitle,
        tagline,
        image,
        ctaPrimaryText,
        ctaPrimaryLink,
        isActive: true
      });

      setTitle('');
      setSubtitle('');
      setImage('');
      fetchSlides();
    } catch (err: any) {
      alert(err.message || 'Slayt eklenemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/hero/${id}`);
      fetchSlides();
    } catch (err: any) {
      alert(err.message || 'Silinemedi.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Hero Slayt Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">
          Ana sayfa tepe bölümündeki vitrin banner ve slaytlarını düzenleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" /> Yeni Slayt Ekle
          </h2>

          <form onSubmit={handleCreateSlide} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Etiket / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Örn: 2026 İLKBAHAR / YAZ KOLEKSİYONU"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Ana Başlık *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Tarzını Tamamlayan Çantalar"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Alt Metin
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Yeni sezon kadın çanta koleksiyonumuzla zarafetinizi öne çıkarın."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Görsel URL *
              </label>
              <input
                type="text"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={ctaPrimaryText}
                  onChange={(e) => setCtaPrimaryText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Buton Linki
                </label>
                <input
                  type="text"
                  value={ctaPrimaryLink}
                  onChange={(e) => setCtaPrimaryLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded transition-colors text-xs"
            >
              Slaytı Kaydet
            </button>
          </form>
        </div>

        {/* Slides List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <p className="text-xs text-slate-500">Yükleniyor...</p>
          ) : slides.length === 0 ? (
            <p className="text-xs text-slate-500">Kayıtlı slayt bulunamadı.</p>
          ) : (
            slides.map((slide) => (
              <div
                key={slide._id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-sm flex gap-4 items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-24 h-16 object-cover rounded bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">{slide.title}</h4>
                    {slide.subtitle && (
                      <p className="text-xs text-slate-400 line-clamp-1">{slide.subtitle}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(slide._id)}
                  className="p-2 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
