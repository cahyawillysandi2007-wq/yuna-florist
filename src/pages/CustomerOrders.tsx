import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Phone,
  Calendar,
  Package,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { formatPrice, cn, generateOrderCode } from '../lib/utils';


export default function CustomerOrders() {
  const [orderCode, setOrderCode] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const formatPickupDate = (dateString?: string) => {
  if (!dateString) return '-';

  if (dateString.includes('/')) return dateString;

  const [year, month, day] = dateString.split('-');

  if (!year || !month || !day) return dateString;

  return `${day}/${month}/${year}`;
};
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderCode.trim()) {
    alert('Masukkan kode pesanan terlebih dahulu.');
    return;
  }


    setLoading(true);
    setSearched(true);

    try {
      const data = await orderService.getOrdersByOrderCode(orderCode.trim());
      setOrders(data);
    } catch (error: any) {
      console.error('Gagal mencari pesanan:', error);
      alert(`Gagal mencari pesanan: ${error.message || 'Terjadi kesalahan.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    const confirmCancel = confirm('Yakin ingin membatalkan pesanan ini?');

    if (!confirmCancel) return;

    try {
  await orderService.requestCancelOrder(orderId);

  const data = await orderService.getOrdersByOrderCode(orderCode.trim());
  setOrders(data);

  alert('Permintaan pembatalan berhasil dikirim. Menunggu persetujuan owner.');
} catch (error) {
  console.error(error);
  alert('Gagal mengajukan pembatalan pesanan.');
}
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'Pesanan Baru';
      case 'Processing':
        return 'Diproses';
      case 'Completed':
        return 'Selesai';
      case 'Cancelled':
        return 'Dibatalkan';
      case 'CancelRequested':
        return 'Menunggu Persetujuan Batal';
      case 'CancelRejected':
        return 'Pembatalan Ditolak Owner';
      default:
        return status;
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'CancelRequested':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CancelRejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return <AlertCircle className="w-4 h-4" />;
      case 'Processing':
        return <Clock className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'CancelRequested':
        return <Clock className="w-4 h-4" />;
      case 'CancelRejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClipboardList className="w-4 h-4" />;
    }
  };

  const canCancel = (status: Order['status']) => {
  return status === 'New' || status === 'Processing';
};

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-lg bg-brand-pink flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7 text-brand-pink-dark" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
            Cek Pesanan
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Masukkan kode pesanan yang tertera di nota atau konfirmasi pesanan.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 md:p-6 mb-8"
        >
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Kode Pesanan
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
              placeholder="Contoh: YF-A7K92P"
              className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-pink-dark"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-pink-dark text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Mencari...' : 'Cari Pesanan'}
            </button>
          </div>
        </form>

        {searched && !loading && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-brand-pink-dark/30 p-10 text-center">
            <Package className="w-10 h-10 text-brand-pink-dark mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold text-slate-800">
              Pesanan Tidak Ditemukan
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Pastikan kode pesanan benar, contoh: YF-A7K92P.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {order.orderCode || generateOrderCode(order.id)}
                  </p>

                  <h3 className="font-bold text-slate-800 mt-1">
                    {order.productName}
                  </h3>
                </div>

                <span
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold w-fit',
                    getStatusStyle(order.status)
                  )}
                >
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-brand-pink-dark" />
                  <span>{order.customerWhatsapp}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-4 h-4 text-brand-pink-dark" />
                  <span>{formatPickupDate(order.pickupDate)}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <Package className="w-4 h-4 text-brand-pink-dark" />
                  <span>{formatPrice(order.productPrice)}</span>
                </div>
              </div>

              {order.note && (
                <div className="mx-5 mb-5 bg-slate-50 border border-slate-100 rounded-lg p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Catatan
                  </p>
                  <p className="text-sm text-slate-600 italic">
                    "{order.note}"
                  </p>
                </div>
              )}

              {order.status === 'CancelRejected' && (
                <div className="mx-5 mb-5 bg-rose-50 border border-rose-100 rounded-lg p-4">
                  <p className="text-sm text-rose-700 font-medium">
                    Permintaan pembatalan ditolak oleh owner. Silakan hubungi admin melalui WhatsApp jika ada kendala.
                  </p>
                </div>
              )}

              {canCancel(order.status) && (
                <div className="p-5 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => handleCancel(order.id!)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Ajukan Pembatalan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}