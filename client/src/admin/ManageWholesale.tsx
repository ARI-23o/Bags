import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, Check, X } from 'lucide-react';
import api from '../services/api';
import { WholesaleEnquiry } from '../types';

export const ManageWholesale: React.FC = () => {
  const [enquiries, setEnquiries] = useState<WholesaleEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<WholesaleEnquiry | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/wholesale/admin/all');
      if (response.data.success) {
        setEnquiries(response.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/wholesale/admin/${id}`, { status });
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry((prev: any) => ({ ...prev, status }));
      }
    } catch (err: any) {
      alert(err.message || 'Güncellenemedi.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[11px]">Beklemede</span>;
      case 'contacted':
        return <span className="text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded text-[11px]">İletişime Geçildi</span>;
      case 'approved':
        return <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">Onaylandı</span>;
      case 'rejected':
        return <span className="text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded text-[11px]">Reddedildi</span>;
      default:
        return <span className="text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Toptan Satış Başvuruları</h1>
        <p className="text-xs text-slate-400 mt-1">
          Butik ve mağazalardan gelen B2B toptan çanta satın alma başvuruları.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/50">
                <th className="p-4 font-semibold">Firma Adı</th>
                <th className="p-4 font-semibold">Yetkili</th>
                <th className="p-4 font-semibold">İletişim</th>
                <th className="p-4 font-semibold">Şehir</th>
                <th className="p-4 font-semibold">Hacim</th>
                <th className="p-4 font-semibold">Durum</th>
                <th className="p-4 font-semibold">Tarih</th>
                <th className="p-4 font-semibold text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Başvurular yükleniyor...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Henüz toptan satış başvurusu bulunmuyor.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{enq.companyName}</td>
                    <td className="p-4 text-slate-300">{enq.contactName}</td>
                    <td className="p-4">
                      <span className="text-slate-300 block">{enq.phone}</span>
                      <span className="text-slate-500 text-[11px]">{enq.email}</span>
                    </td>
                    <td className="p-4 text-slate-400">{enq.city}</td>
                    <td className="p-4 text-amber-400 font-semibold">{enq.estimatedVolume}</td>
                    <td className="p-4">{getStatusBadge(enq.status)}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="p-1.5 text-slate-400 hover:text-amber-400"
                        title="İncele"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-sm w-full max-w-2xl z-10 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">TOPTAN BAŞVURU</span>
                <h3 className="font-serif text-2xl font-bold text-amber-400">
                  {selectedEnquiry.companyName}
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
              <div>
                <span className="text-slate-500 block">Yetkili Kişi:</span>
                <span className="font-semibold text-white">{selectedEnquiry.contactName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">İşletme Türü:</span>
                <span className="font-semibold text-white">{selectedEnquiry.businessType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Telefon:</span>
                <span className="font-semibold text-white">{selectedEnquiry.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">E-Posta:</span>
                <span className="font-semibold text-white">{selectedEnquiry.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Şehir / Ülke:</span>
                <span className="font-semibold text-white">{selectedEnquiry.city}, {selectedEnquiry.country}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Aylık Tahmini Hacim:</span>
                <span className="font-semibold text-amber-400">{selectedEnquiry.estimatedVolume}</span>
              </div>
              {selectedEnquiry.instagramHandle && (
                <div>
                  <span className="text-slate-500 block">Instagram:</span>
                  <span className="font-semibold text-slate-300">{selectedEnquiry.instagramHandle}</span>
                </div>
              )}
              {selectedEnquiry.website && (
                <div>
                  <span className="text-slate-500 block">Web Sitesi:</span>
                  <span className="font-semibold text-slate-300">{selectedEnquiry.website}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1">Müşteri Mesajı:</span>
              <p className="p-4 bg-slate-950 border border-slate-800 rounded leading-relaxed text-slate-200">
                {selectedEnquiry.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=Merhaba%20${encodeURIComponent(selectedEnquiry.contactName)},%20Nehir%20Çanta%20toptan%20satış%20başvurunuz%20hakkında%20yazıyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp'tan İletişime Geç
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedEnquiry._id, 'contacted')}
                  className="px-3 py-2 bg-blue-950/80 border border-blue-800 text-blue-300 rounded font-semibold"
                >
                  Görüşüldü Yap
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedEnquiry._id, 'approved')}
                  className="px-3 py-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded font-semibold"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
