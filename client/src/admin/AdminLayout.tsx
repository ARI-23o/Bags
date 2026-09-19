import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Sparkles,
  Building2,
  Mail,
  Ticket,
  Sliders,
  Instagram,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Kontrol Paneli', path: '/admin', icon: LayoutDashboard },
    { label: 'Ürün Yönetimi', path: '/admin/products', icon: Package },
    { label: 'Siparişler', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Kategoriler', path: '/admin/categories', icon: FolderTree },
    { label: 'Koleksiyonlar', path: '/admin/collections', icon: Sparkles },
    { label: 'Toptan Başvurular', path: '/admin/wholesale', icon: Building2 },
    { label: 'İletişim Mesajları', path: '/admin/contact', icon: Mail },
    { label: 'Kuponlar', path: '/admin/coupons', icon: Ticket },
    { label: 'Yorumlar', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Hero Slaytları', path: '/admin/hero', icon: Sliders },
    { label: 'Instagram Vitrini', path: '/admin/instagram', icon: Instagram },
    { label: 'Mağaza Ayarları', path: '/admin/settings', icon: Settings },
    { label: 'Güvenlik & Loglar', path: '/admin/audit-logs', icon: ShieldAlert }
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-luxury text-amber-400">
                {settings.brandName || 'NEHİR ÇANTA'}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                YÖNETİM PANELİ
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="font-semibold text-slate-200 block truncate">
                {admin?.name || 'Yönetici'}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {admin?.role || 'Admin'}
              </span>
            </div>
            <Link
              to="/"
              target="_blank"
              className="text-slate-400 hover:text-amber-400 p-1"
              title="Siteyi Görüntüle"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold rounded-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-slate-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-lg font-bold text-amber-400">
            {settings.brandName || 'NEHİR ÇANTA'}
          </span>
          <div className="w-6" />
        </header>

        {/* Sub-view Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
