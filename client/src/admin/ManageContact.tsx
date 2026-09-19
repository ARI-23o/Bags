import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle, MessageCircle, X } from 'lucide-react';
import api from '../services/api';

export const ManageContact: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contact/admin/all');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/contact/admin/${id}`, { isRead: true, status: 'replied' });
      fetchMessages();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage((prev: any) => ({ ...prev, isRead: true, status: 'replied' }));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">İletişim Mesajları</h1>
        <p className="text-xs text-slate-400 mt-1">
          Web sitesi iletişim formundan gelen müşteri mesajları ve talepleri.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Ad Soyad</th>
              <th className="p-4">Konu</th>
              <th className="p-4">İletişim</th>
              <th className="p-4">Durum</th>
              <th className="p-4">Tarih</th>
              <th className="p-4 text-right">İncele</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Mesajlar yükleniyor...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Henüz gelen bir mesaj bulunmuyor.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" title="Okunmadı" />
                      )}
                      <span>{msg.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-200">{msg.subject}</td>
                  <td className="p-4">
                    <span className="text-slate-300 block">{msg.email}</span>
                    {msg.phone && <span className="text-slate-500 text-[11px]">{msg.phone}</span>}
                  </td>
                  <td className="p-4">
                    {msg.isRead ? (
                      <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                        Okundu / Yanıtlandı
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[11px]">
                        Yeni Mesaj
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                    >
                      Görüntüle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-slate-100">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMessage(null)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-sm w-full max-w-xl z-10 p-6 sm:p-8 space-y-5 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">MESAJ DETAYI</span>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-1">
              <p><strong>Gönderen:</strong> {selectedMessage.name}</p>
              <p><strong>E-Posta:</strong> {selectedMessage.email}</p>
              {selectedMessage.phone && <p><strong>Telefon:</strong> {selectedMessage.phone}</p>}
              <p className="text-slate-500 text-[11px]">Tarih: {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}</p>
            </div>

            <div>
              <span className="font-bold text-slate-400 block mb-1">Mesaj Metni:</span>
              <p className="p-4 bg-slate-950 border border-slate-800 rounded leading-relaxed text-slate-200">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              {selectedMessage.phone && (
                <a
                  href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}?text=Merhaba%20${encodeURIComponent(selectedMessage.name)},%20Nehir%20Çanta%20iletişim%20mesajınız%20hakkında%20yazıyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn-whatsapp"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Yanıtla
                </a>
              )}

              {!selectedMessage.isRead && (
                <button
                  onClick={() => handleMarkAsRead(selectedMessage._id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded uppercase tracking-wider text-xs"
                >
                  Okundu Olarak İşaretle
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
