import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  ChevronRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Order } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    newOrders: 0,
    totalSales: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, orders] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders()
        ]);

        const completedOrders = orders.filter(o => o.status === 'Completed');
        const sales = completedOrders.reduce((sum, o) => sum + o.productPrice, 0);

        setStats({
          totalProducts: products.length,
          availableProducts: products.filter(p => p.isAvailable).length,
          newOrders: orders.filter(o => o.status === 'New').length,
          totalSales: sales
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Produk Ready', value: stats.availableProducts, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pesanan Baru', value: stats.newOrders, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Penjualan Selesai', value: formatPrice(stats.totalSales), icon: TrendingUp, color: 'text-brand-pink-dark', bg: 'bg-brand-pink' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Halo, Owner Yuna Florist!</h2>
           <p className="text-sm text-slate-400">Berikut adalah ringkasan performa toko Anda hari ini.</p>
        </div>
        <Link 
          to="/admin/products" 
          className="bg-brand-pink-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-pink-dark/90 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex items-center gap-5 transition-transform hover:translate-y-[-4px]">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <ShoppingBag className="w-5 h-5 text-brand-pink-dark" /> Pesanan Terbaru
              </h3>
              <Link to="/admin/orders" className="text-xs font-bold text-brand-pink-dark hover:underline flex items-center gap-1">
                 Lihat Semua <ArrowUpRight className="w-3 h-3" />
              </Link>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                    <tr>
                       <th className="px-6 py-4">Pelanggan</th>
                       <th className="px-6 py-4">Produk</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Waktu</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      [1,2,3].map(i => <tr key={i} className="animate-pulse px-6 py-4 h-16 bg-white/50" />)
                    ) : recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                              <p className="text-[10px] text-slate-400">{order.customerWhatsapp}</p>
                           </td>
                           <td className="px-6 py-4 text-sm text-slate-600 font-medium">{order.productName}</td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                order.status === 'New' ? "bg-amber-100 text-amber-700" :
                                order.status === 'Processing' ? "bg-blue-100 text-blue-700" :
                                order.status === 'Completed' ? "bg-green-100 text-green-700" :
                                "bg-slate-100 text-slate-500"
                              )}>
                                {order.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-[10px] text-slate-400 font-medium">
                              {order.createdAt ? format(order.createdAt.toDate(), 'dd MMM HH:mm', { locale: idLocale }) : '-'}
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic text-sm">Belum ada pesanan masuk.</td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
           <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                 <h4 className="font-serif text-xl font-bold mb-2">Tips Hari Ini</h4>
                 <p className="text-slate-400 text-xs leading-relaxed mb-6 italic">
                   "Jangan lupa update status ketersediaan produk agar pelanggan tidak kecewa saat memesan."
                 </p>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-pink-dark">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-500">Terakhir Update</p>
                       <p className="text-xs font-bold">12 Menit Lalu</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-brand-pink p-6 rounded-2xl border border-brand-pink-dark/10">
              <h4 className="font-bold text-brand-pink-dark mb-4 flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Pintasan Cepat
              </h4>
              <div className="grid grid-cols-1 gap-2">
                 <Link to="/admin/products" className="bg-white p-3 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center justify-between hover:bg-slate-50">
                    Kelola Produk <ChevronRight className="w-3 h-3 text-slate-300" />
                 </Link>
                 <Link to="/admin/categories" className="bg-white p-3 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center justify-between hover:bg-slate-50">
                    Atur Kategori <ChevronRight className="w-3 h-3 text-slate-300" />
                 </Link>
                 <Link to="/admin/settings" className="bg-white p-3 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center justify-between hover:bg-slate-50">
                    Ubah Info Toko <ChevronRight className="w-3 h-3 text-slate-300" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
