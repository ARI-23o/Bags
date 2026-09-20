import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const { settings } = useSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/admin/login', {
        email: email.trim().toLowerCase(),
        password
      });

      if (response.data.success && response.data.admin && response.data.token) {
        loginAdmin(response.data.token, response.data.admin);
        navigate('/admin');
      } else {
        setError(response.data.message || 'Giriş başarısız.');
      }
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-sm p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold uppercase tracking-luxury text-amber-400 block">
            {settings.brandName || 'NEHİR ÇANTA'}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">
            YÖNETİCİ GİRİŞİ
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              E-Posta Adresi
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nehircanta.com"
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-3 py-3 text-xs text-white rounded-sm focus:outline-none focus:border-amber-400"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-3 py-3 text-xs text-white rounded-sm focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Mağazaya Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
};
