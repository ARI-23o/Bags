import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, Ticket } from 'lucide-react';
import api from '../services/api';
import { Coupon } from '../types';
import { formatTRY } from '../utils/currency';

export const ManageCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/coupons/admin/all');
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    try {
      await api.post('/coupons', {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0
      });

      setCode('');
      setDiscountValue('');
      setMinOrderAmount('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Kupon oluşturulamadı.');
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`"${couponCode}" kuponunu silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message || 'Silinemedi.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Kupon & İndirim Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">
          Müşterilerinize özel promosyon ve indirim kodları tanımlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" /> Yeni Kupon Tanımla
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Kupon Kodu *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Örn: BAHAR20"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white uppercase font-mono font-bold focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  İndirim Türü
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
                >
                  <option value="percent">Yüzde (%)</option>
                  <option value="fixed">Sabit Tutar (₺)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Miktar / Oran *
                </label>
                <input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={discountType === 'percent' ? '15' : '100'}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Min. Sepet Tutarı (₺)
              </label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Örn: 500"
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider rounded transition-colors text-xs"
            >
              Kuponu Oluştur
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Kupon Kodu</th>
                <th className="p-4">İndirim Oranı/Tutarı</th>
                <th className="p-4">Min. Sepet</th>
                <th className="p-4">Kullanım</th>
                <th className="p-4 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Kayıtlı kupon bulunmuyor.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-amber-400 text-sm">
                      {coupon.code}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {coupon.discountType === 'percent'
                        ? `%{coupon.discountValue}`
                        : formatTRY(coupon.discountValue)}
                    </td>
                    <td className="p-4 text-slate-300">
                      {coupon.minOrderAmount ? formatTRY(coupon.minOrderAmount) : 'Yok'}
                    </td>
                    <td className="p-4 text-slate-400">{coupon.usedCount} kez</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon._id, coupon.code)}
                        className="p-1.5 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
