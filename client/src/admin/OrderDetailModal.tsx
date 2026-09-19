import React, { useState } from 'react';
import { X, Printer, Truck, Check, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { formatTRY } from '../utils/currency';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
  onStatusUpdated
}) => {
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [trackingCarrier, setTrackingCarrier] = useState(order.trackingCarrier || 'Yurtiçi Kargo');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      await api.put(`/orders/admin/${order._id}`, {
        orderStatus,
        paymentStatus,
        trackingNumber,
        trackingCarrier,
        adminNotes
      });
      onStatusUpdated();
    } catch (err: any) {
      alert(err.message || 'Güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappText = `Merhaba ${order.customer.firstName} Hanım/Bey, Nehir Çanta'dan vermiş olduğunuz ${order.orderNumber} numaralı siparişiniz hakkında bilgilendirme: Durum: ${orderStatus.toUpperCase()}${trackingNumber ? `, Kargo Takip No: ${trackingNumber} (${trackingCarrier})` : ''}`;
  const whatsappUrl = `https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-slate-100">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-800 rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">SİPARİŞ DETAYI</span>
            <h2 className="font-serif text-2xl font-bold text-amber-400 font-mono">
              {order.orderNumber}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white border border-slate-800 rounded"
              title="Yazdır"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Customer & Address Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1.5">
            <span className="font-bold text-amber-400 block mb-2">Müşteri Bilgileri</span>
            <p className="font-semibold text-white">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-slate-400">E-posta: {order.customer.email}</p>
            <p className="text-slate-400">Telefon: {order.customer.phone}</p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#25D366] hover:underline font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Müşteriye WhatsApp'tan Yaz
              </a>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm space-y-1.5">
            <span className="font-bold text-amber-400 block mb-2">Teslimat Adresi</span>
            <p className="text-slate-300">{order.shippingAddress.address}</p>
            <p className="text-slate-300">
              {order.shippingAddress.district} / {order.shippingAddress.city}
            </p>
            {order.shippingAddress.postalCode && (
              <p className="text-slate-500">Posta Kodu: {order.shippingAddress.postalCode}</p>
            )}
            {order.notes && (
              <p className="text-amber-300/80 pt-1">
                <strong>Sipariş Notu:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300 block">
            Sipariş Edilen Çantalar ({order.items.length})
          </span>
          <div className="border border-slate-800 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">Ürün</th>
                  <th className="p-3">Renk</th>
                  <th className="p-3">Birim Fiyat</th>
                  <th className="p-3">Adet</th>
                  <th className="p-3 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-8 h-10 object-cover rounded bg-slate-800"
                          />
                        )}
                        <div>
                          <span className="font-semibold text-white block">{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{item.color?.name || '-'}</td>
                    <td className="p-3 text-slate-300">{formatTRY(item.price)}</td>
                    <td className="p-3 text-white font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-bold text-white">
                      {formatTRY(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Totals */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-sm text-xs space-y-1.5 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span className="text-slate-400">Ara Toplam:</span>
            <span className="font-semibold text-white">{formatTRY(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Kargo Ücreti:</span>
            <span className="font-semibold text-white">
              {order.shippingFee === 0 ? 'Ücretsiz' : formatTRY(order.shippingFee)}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>İndirim ({order.couponCode}):</span>
              <span>-{formatTRY(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-amber-400 pt-2 border-t border-slate-800">
            <span>Genel Toplam:</span>
            <span>{formatTRY(order.total)}</span>
          </div>
        </div>

        {/* Status & Tracking Controls */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-sm space-y-4">
          <span className="font-bold text-xs uppercase tracking-wider text-amber-400 block">
            Sipariş Durumu & Kargo Yönetimi
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Sipariş Durumu</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              >
                <option value="pending">Beklemede (Ödeme Kontrolü)</option>
                <option value="confirmed">Onaylandı</option>
                <option value="processing">Hazırlanıyor</option>
                <option value="shipped">Kargoya Verildi</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
                <option value="refunded">İade Edildi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Ödeme Durumu</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              >
                <option value="pending">Beklemede</option>
                <option value="paid">Ödendi (Tahsil Edildi)</option>
                <option value="failed">Başarısız</option>
                <option value="refunded">İade Edildi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Kargo Firması</label>
              <input
                type="text"
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                placeholder="Yurtiçi Kargo"
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Kargo Takip No</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="123456789012"
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">Yönetici Notu (İç Kullanım)</label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Örn: Müşteri arandı, renk onayı alındı."
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveStatus}
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider text-xs rounded transition-colors"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
