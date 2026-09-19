import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import api from '../services/api';
import { Order, Product } from '../types';
import { formatTRY } from '../utils/currency';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/orders/admin/stats');
        if (response.data.success) {
          setStats(response.data.stats || {});
          setRecentOrders(response.data.recentOrders || []);
          setLowStockProducts(response.data.lowStockProducts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Yönetim & Kontrol Paneli
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mağazanızın satış performansı, sipariş akışı ve stok durumunu takip edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-sm flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Toplam Ciro
            </span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {formatTRY(stats.totalRevenue)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-sm flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Toplam Sipariş
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {stats.totalOrders}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-sm flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Bekleyen Sipariş
            </span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {stats.pendingOrders}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-sm flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Aktif Çanta Modeli
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {stats.totalProducts}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-serif text-xl font-bold text-white">
              Son Siparişler
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Tüm Siparişleri Gör <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">
              Henüz sipariş kaydı bulunmuyor.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Sipariş No</th>
                    <th className="pb-3 font-semibold">Müşteri</th>
                    <th className="pb-3 font-semibold">Tutar</th>
                    <th className="pb-3 font-semibold">Durum</th>
                    <th className="pb-3 font-semibold text-right">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-amber-400">
                        <Link to="/admin/orders">{order.orderNumber}</Link>
                      </td>
                      <td className="py-3 text-slate-200">
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {formatTRY(order.total)}
                      </td>
                      <td className="py-3">{getStatusBadge(order.orderStatus)}</td>
                      <td className="py-3 text-right text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-serif text-xl font-bold text-white">
              Kritik Stok Uyarıları
            </h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Tüm ürünlerin stok seviyesi yeterli.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {p.primaryImage && (
                      <img
                        src={p.primaryImage}
                        alt={p.title}
                        className="w-10 h-12 object-cover rounded bg-slate-800"
                      />
                    )}
                    <div>
                      <span className="font-semibold text-white block line-clamp-1">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {p.sku}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-red-950/80 border border-red-800 text-red-300 font-bold rounded text-[11px] block">
                      {p.stock === 0 ? 'Tükendi' : `${p.stock} Adet`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
