import React, { useEffect, useState } from 'react';
import { Search, Eye, Filter, Truck } from 'lucide-react';
import api from '../services/api';
import { Order } from '../types';
import { formatTRY } from '../utils/currency';
import { OrderDetailModal } from './OrderDetailModal';

export const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/admin/all', {
        params: {
          status: statusFilter,
          search
        }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[11px]">Beklemede</span>;
      case 'confirmed':
        return <span className="text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded text-[11px]">Onaylandı</span>;
      case 'processing':
        return <span className="text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded text-[11px]">Hazırlanıyor</span>;
      case 'shipped':
        return <span className="text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded text-[11px]">Kargoya Verildi</span>;
      case 'delivered':
        return <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">Teslim Edildi</span>;
      case 'cancelled':
        return <span className="text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded text-[11px]">İptal</span>;
      default:
        return <span className="text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Sipariş Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">
          Gelen müşteri siparişlerini onaylayın, hazırlayın ve kargo takip numaralarını girin.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sipariş No, Müşteri Adı, E-posta veya Telefon..."
            className="w-full bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white rounded-sm focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </form>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-white py-2.5 px-3 rounded-sm focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="processing">Hazırlanıyor</option>
            <option value="shipped">Kargoya Verildi</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-950/50">
                <th className="p-4 font-semibold">Sipariş No</th>
                <th className="p-4 font-semibold">Müşteri</th>
                <th className="p-4 font-semibold">Şehir</th>
                <th className="p-4 font-semibold">Ödeme Türü</th>
                <th className="p-4 font-semibold">Tutar</th>
                <th className="p-4 font-semibold">Durum</th>
                <th className="p-4 font-semibold">Tarih</th>
                <th className="p-4 font-semibold text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Siparişler yükleniyor...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Sipariş kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {order.orderNumber}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">
                        {order.customer.firstName} {order.customer.lastName}
                      </span>
                      <span className="text-[11px] text-slate-400">{order.customer.phone}</span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {order.shippingAddress.city}
                    </td>
                    <td className="p-4 uppercase text-slate-400 text-[11px]">
                      {order.paymentMethod === 'havale_eft'
                        ? 'Havale/EFT'
                        : order.paymentMethod === 'kapida_odeme'
                        ? 'Kapıda Ödeme'
                        : 'Kredi Kartı'}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {formatTRY(order.total)}
                    </td>
                    <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Sipariş Detayı"
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={() => {
            setSelectedOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};
