import React, { useEffect, useState } from 'react';
import { Check, X, Star, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { Review } from '../types';

export const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews/admin/all');
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/reviews/admin/${id}`, { status });
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Güncellenemedi.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Yorum & Değerlendirme Moderasyonu</h1>
        <p className="text-xs text-slate-400 mt-1">
          Müşterilerden gelen ürün yorumlarını onaylayın veya reddedin.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Müşteri</th>
              <th className="p-4">Puan</th>
              <th className="p-4">Yorum</th>
              <th className="p-4">Durum</th>
              <th className="p-4">Tarih</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Yorumlar yükleniyor...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Henüz gelen bir ürün yorumu bulunmuyor.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">
                    {rev.name}
                    <span className="text-[11px] text-slate-500 block font-normal">{rev.email}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-sm text-slate-200">
                    <p className="line-clamp-2">{rev.comment}</p>
                  </td>
                  <td className="p-4">
                    {rev.status === 'approved' ? (
                      <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                        Onaylandı
                      </span>
                    ) : rev.status === 'rejected' ? (
                      <span className="text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded text-[11px]">
                        Reddedildi
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[11px]">
                        Onay Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdateStatus(rev._id, 'approved')}
                        className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded hover:bg-emerald-900"
                        title="Onayla"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                        className="p-1.5 bg-red-950 text-red-400 border border-red-800 rounded hover:bg-red-900"
                        title="Reddet"
                      >
                        <X className="w-4 h-4" />
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
  );
};
