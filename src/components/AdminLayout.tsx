import React from 'react';
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
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Produk', icon: Package, path: '/admin/products' },
    { label: 'Kategori', icon: Layers, path: '/admin/categories' },
    { label: 'Pesanan', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Pengaturan', icon: Settings, path: '/admin/settings' },
  ];

  const currentModule = menuItems.find(item => item.path === location.pathname) || { label: 'Admin Panel' };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <Flower2 className="text-brand-pink-dark w-5 h-5" />
            <div>
              <span className="block font-serif text-sm font-bold leading-none text-brand-sage">Yuna Florist</span>
              <span className="block text-[8px] uppercase tracking-widest text-brand-pink-dark font-bold">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                location.pathname === item.path 
                  ? "bg-brand-pink text-brand-pink-dark shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
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
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">
              {currentModule.label}
            </h1>
            <div className="sm:hidden flex items-center gap-1 font-bold text-slate-800">
               <span className="text-brand-pink-dark uppercase text-[10px] tracking-tight">Admin</span>
               <ChevronRight className="w-4 h-4 text-slate-300" />
               <span className="text-sm truncate max-w-[120px]">{currentModule.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-sm font-semibold text-slate-700">Yuna Admin</span>
               <span className="text-[10px] text-slate-400">Owner Florist</span>
             </div>
             <div className="w-9 h-9 rounded-full bg-brand-pink-dark flex items-center justify-center text-white font-bold text-sm">
               Y
             </div>
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
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[60] w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
            <Flower2 className="text-brand-pink-dark w-5 h-5" />
            <span className="font-serif text-lg font-bold text-brand-sage">Yuna Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-all border-l-4",
                location.pathname === item.path 
                  ? "bg-brand-pink text-brand-pink-dark border-brand-pink-dark shadow-sm" 
                  : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
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
