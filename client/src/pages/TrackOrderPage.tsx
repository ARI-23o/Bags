import React, { useState } from 'react';
import { Search, PackageCheck, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { formatTRY } from '../utils/currency';
import { SEOHelmet } from '../components/common/SEOHelmet';

export const TrackOrderPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !contact.trim()) {
      setError('Lütfen sipariş numaranızı ve e-posta/telefon bilginizi giriniz.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await api.get('/orders/track', {
        params: {
          orderNumber: orderNumber.trim(),
          contact: contact.trim()
        }
      });

      if (response.data.success && response.data.order) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || 'Sipariş bulunamadı.');
      }
    } catch (err: any) {
      setError(err.message || 'Sipariş sorgulanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded text-xs font-semibold">Beklemede (Ödeme Kontrolü)</span>;
      case 'confirmed':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded text-xs font-semibold">Sipariş Onaylandı</span>;
      case 'processing':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded text-xs font-semibold">Hazırlanıyor</span>;
      case 'shipped':
        return <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded text-xs font-semibold">Kargoya Verildi</span>;
      case 'delivered':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded text-xs font-semibold">Teslim Edildi</span>;
      case 'cancelled':
        return <span className="text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded text-xs font-semibold">İptal Edildi</span>;
      default:
        return <span className="text-brand-charcoal bg-brand-cream px-3 py-1 rounded text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <>
      <SEOHelmet title="Sipariş Takibi | Nehir Çanta" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-1">
            KOLAY TAKİP
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            Sipariş Takibi
          </h1>
          <p className="text-xs sm:text-sm text-brand-taupe mt-2">
            Sipariş numaranız ve siparişte kullandığınız telefon veya e-posta adresi ile kargo durumunuzu anlık olarak sorgulayabilirsiniz.
          </p>
        </div>

        {/* Tracking Query Form */}
        <div className="bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-8 shadow-sm mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                Sipariş Numarası *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Örn: NC-2026-123456"
                className="w-full bg-brand-bg border border-brand-border p-3 text-xs uppercase focus:outline-none focus:border-brand-primary rounded-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-luxury text-brand-primary mb-1">
                Telefon Numarası veya E-Posta *
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="0532XXXXXXX veya ornek@mail.com"
                className="w-full bg-brand-bg border border-brand-border p-3 text-xs focus:outline-none focus:border-brand-primary rounded-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn-primary"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Sorgulanıyor...' : 'Siparişi Sorgula'}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {order && (
          <div className="bg-brand-bg border border-brand-border rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-2">
              <div>
                <span className="text-xs text-brand-taupe block">Sipariş No:</span>
                <span className="font-serif text-2xl font-bold text-brand-primary">
                  {order.orderNumber}
                </span>
              </div>
              <div>{getStatusBadge(order.orderStatus)}</div>
            </div>

            {/* Tracking Code if Shipped */}
            {order.trackingNumber && (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-sm text-xs text-indigo-900 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Kargo Takip Bilgisi:</span>
                  <span>{order.trackingCarrier || 'Yurtiçi Kargo'} - Takip No: <strong>{order.trackingNumber}</strong></span>
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-primary mb-3">
                Ürünler ({order.items.length})
              </h4>
              <div className="space-y-2 border border-brand-border rounded-sm p-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-brand-border/40 last:border-none">
                    <span>
                      {item.title} {item.color?.name && `(${item.color.name})`} × {item.quantity} Adet
                    </span>
                    <span className="font-semibold text-brand-primary">
                      {formatTRY(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Total */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-brand-charcoal pt-2">
              <div className="p-3 bg-brand-cream/30 rounded-sm">
                <span className="font-bold text-brand-primary block mb-1">Teslimat Adresi:</span>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.district} / {order.shippingAddress.city}</p>
              </div>

              <div className="p-3 bg-brand-cream/30 rounded-sm flex flex-col justify-between">
                <div>
                  <span className="font-bold text-brand-primary block mb-1">Toplam Tutar:</span>
                  <span className="text-lg font-bold text-brand-primary">{formatTRY(order.total)}</span>
                </div>
                <span className="text-[11px] text-brand-taupe mt-2">
                  Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
