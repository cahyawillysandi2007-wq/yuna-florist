import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  Flower2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { StoreSettings } from '../types';
import { storeSettingsService } from '../services/storeSettingsService';
import { orderService } from '../services/orderService';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Produk', icon: Package, path: '/admin/products' },
    { label: 'Kategori', icon: Layers, path: '/admin/categories' },
    { label: 'Pesanan', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Pengaturan', icon: Settings, path: '/admin/settings' }
  ];

  const currentModule =
    menuItems.find((item) => item.path === location.pathname) || {
      label: 'Admin Panel'
    };

  const loadSettings = async () => {
    try {
      const data = await storeSettingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Gagal memuat admin settings:', error);
    }
  };

  const getOrderCreatedTime = (order: any) => {
    if (order.createdAt?.seconds) {
      return order.createdAt.seconds * 1000;
    }

    if (order.createdAt?.toDate) {
      return order.createdAt.toDate().getTime();
    }

    return 0;
  };

  const loadNewOrderCount = async () => {
    try {
      const orders = await orderService.getOrders();
      const lastSeen = Number(localStorage.getItem('lastSeenOrdersAt') || 0);

      const count = orders.filter((order: any) => {
        const createdAt = getOrderCreatedTime(order);
        return createdAt > lastSeen;
      }).length;

      setNewOrderCount(count);
    } catch (error) {
      console.error('Gagal memuat notifikasi pesanan:', error);
    }
  };

  useEffect(() => {
    loadSettings();
    loadNewOrderCount();

    const interval = setInterval(() => {
      loadNewOrderCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname === '/admin/orders') {
      localStorage.setItem('lastSeenOrdersAt', String(Date.now()));
      setNewOrderCount(0);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const renderMenuLabel = (item: (typeof menuItems)[number]) => {
    const showOrderBadge = item.path === '/admin/orders' && newOrderCount > 0;

    return (
      <div className="flex items-center justify-between w-full min-w-0">
        <span className="truncate">{item.label}</span>

        {showOrderBadge && (
          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
            {newOrderCount > 99 ? '99+' : newOrderCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || 'Logo Toko'}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-100 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-pink-dark">
                <Flower2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <span className="block font-serif text-sm font-bold leading-none text-brand-sage">
                {settings?.storeName || 'Yuna Florist'}
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-brand-pink-dark font-bold">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'bg-brand-pink text-brand-pink-dark shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {renderMenuLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header Mobile & Topbar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="lg:hidden p-2 text-slate-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">
              {currentModule.label}
            </h1>

            <div className="sm:hidden flex items-center gap-1 font-bold text-slate-800 min-w-0">
              <span className="text-brand-pink-dark uppercase text-[10px] tracking-tight">
                Admin
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              <span className="text-sm truncate max-w-[120px]">
                {currentModule.label}
              </span>

              {location.pathname !== '/admin/orders' && newOrderCount > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                  {newOrderCount > 99 ? '99+' : newOrderCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-700">
                Admin
              </span>
              <span className="text-[10px] text-slate-400">
                Owner Florist
              </span>
            </div>

            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || 'Logo Toko'}
                className="w-10 h-10 rounded-full object-contain bg-white border border-slate-100 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-pink-dark text-white flex items-center justify-center font-bold">
                Y
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[60] w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 lg:hidden',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName || 'Logo Toko'}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-100 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-brand-pink-dark">
                <Flower2 className="w-5 h-5" />
              </div>
            )}

            <div>
              <span className="block font-serif text-base font-bold text-brand-sage leading-none">
                Yuna Admin
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-brand-pink-dark font-bold">
                Dashboard
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-all border-l-4',
                location.pathname === item.path
                  ? 'bg-brand-pink text-brand-pink-dark border-brand-pink-dark shadow-sm'
                  : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900'
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              {renderMenuLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-4 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-6 h-6" />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </div>
  );
}