import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ExternalLink,
  User,
  Phone,
  Search,
  Trash2,
  Download,
  Copy,
  MessageCircle,
  MapPin,
  Truck,
  CalendarDays,
  StickyNote
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { formatPrice, cn, generateOrderCode } from '../lib/utils';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getSafeOrderCode = (order: any) => {
    if (order.orderCode && String(order.orderCode).trim()) {
      return String(order.orderCode).trim();
    }

    if (order.id) {
      return generateOrderCode(String(order.id));
    }

    return '-';
  };

  const getOrderMethod = (order: any) => {
    return order.orderMethod || 'Ambil di Tempat';
  };

  const getCleanNote = (order: any) => {
    const rawNote = String(order.note || '').trim();

    if (!rawNote || rawNote === '-') return '';

    const blockedKeywords = [
      'Metode Pesanan:',
      'Tanggal Ambil:',
      'Info Pengiriman:',
      'Alamat Pengiriman:',
      'Link Lokasi:'
    ];

    const lines = rawNote
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !blockedKeywords.some((keyword) => line.includes(keyword)));

    const cleanText = lines.join('\n').trim();

    if (!cleanText || cleanText === '-') return '';

    return cleanText;
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOrder = async (id?: string) => {
    if (!id) {
      alert('ID pesanan tidak ditemukan.');
      return;
    }

    const confirmDelete = confirm(
      'Yakin ingin menghapus pesanan ini? Data yang dihapus tidak bisa dikembalikan.'
    );

    if (!confirmDelete) return;

    try {
      await orderService.deleteOrder(id);
      await loadOrders();
      alert('Pesanan berhasil dihapus.');
    } catch (error: any) {
      console.error('Gagal menghapus pesanan:', error);
      alert(`Gagal menghapus pesanan: ${error.message || 'Terjadi kesalahan.'}`);
    }
  };

  const filteredOrders = orders.filter((o: any) => {
    const keyword = searchTerm.toLowerCase();
    const code = getSafeOrderCode(o).toLowerCase();

    const matchStatus = filterStatus === 'all' || o.status === filterStatus;

    const matchSearch =
      o.customerName.toLowerCase().includes(keyword) ||
      o.productName.toLowerCase().includes(keyword) ||
      code.includes(keyword);

    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'CancelRequested':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'CancelRejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'Baru';
      case 'Processing':
        return 'Diproses';
      case 'Completed':
        return 'Selesai';
      case 'Cancelled':
        return 'Dibatalkan';
      case 'CancelRequested':
        return 'Minta Dibatalkan';
      case 'CancelRejected':
        return 'Pembatalan Ditolak';
      default:
        return status;
    }
  };

  const formatPickupDate = (dateString?: string) => {
    if (!dateString || dateString === '-') return '-';

    if (dateString.includes('/')) return dateString;

    const [year, month, day] = dateString.split('-');

    if (!year || !month || !day) return dateString;

    return `${day}/${month}/${year}`;
  };

  const formatWhatsAppNumber = (phone: string) => {
    if (!phone) return '';

    let number = phone.replace(/\D/g, '');

    if (number.startsWith('0')) {
      number = '62' + number.slice(1);
    }

    if (!number.startsWith('62')) {
      number = '62' + number;
    }

    return number;
  };

  const handleContactCustomer = (order: any) => {
    const waNumber = formatWhatsAppNumber(order.customerWhatsapp);

    if (!waNumber) {
      alert('Nomor WhatsApp pembeli tidak tersedia.');
      return;
    }

    const orderCode = getSafeOrderCode(order);

    const message = `Halo kak ${order.customerName || ''}, pesanan Anda di Yuna Florist sudah selesai.

Detail Pesanan:
- Kode Pesanan: ${orderCode}
- Produk: ${order.productName || '-'}
- Total: ${order.productPrice ? formatPrice(order.productPrice) : '-'}
- Status: Selesai

Silakan konfirmasi untuk pengambilan/pengiriman pesanan. Terima kasih.`;

    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    window.open(waLink, '_blank');
  };

  const handleDownloadReceipt = (order: any) => {
    const orderCode = getSafeOrderCode(order);
    const orderMethod = getOrderMethod(order);
    const cleanNote = getCleanNote(order);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 1350;

    const formatCanvasDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const drawRoundRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawLabelValue = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = '#8A8A8A';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(label.toUpperCase(), x, y);

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 25px Arial';
      ctx.fillText(value || '-', x, y + 35);
    };

    const drawWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, x, currentY);
          line = words[i] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line, x, currentY);
    };

    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(55, 55, 790, 1240, 26);

    ctx.fillStyle = '#C95F7C';
    drawRoundRect(55, 55, 790, 190, 26);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(130, 145, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#C95F7C';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('YF', 106, 157);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Georgia';
    ctx.fillText('Yuna Florist Adiluwih', 195, 130);

    ctx.font = 'bold 20px Arial';
    ctx.fillText('Nota Pesanan Resmi', 198, 165);

    ctx.font = '16px Arial';
    ctx.fillText('Florist & Gift • Buket untuk momen spesial', 198, 195);

    ctx.fillStyle = '#FDF2F4';
    drawRoundRect(95, 285, 710, 115, 18);

    ctx.fillStyle = '#C95F7C';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('KODE PESANAN', 125, 330);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(orderCode, 125, 375);

    ctx.fillStyle = '#64748B';
    ctx.font = '18px Arial';
    ctx.fillText(`Tanggal Nota: ${formatCanvasDate()}`, 535, 340);

    ctx.fillStyle = '#9CA986';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('DATA PEMESAN', 95, 465);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95, 485);
    ctx.lineTo(805, 485);
    ctx.stroke();

    drawLabelValue('Nama Pemesan', order.customerName, 95, 540);
    drawLabelValue('WhatsApp', order.customerWhatsapp, 480, 540);

    ctx.fillStyle = '#9CA986';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('DETAIL PESANAN', 95, 645);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95, 665);
    ctx.lineTo(805, 665);
    ctx.stroke();

    drawLabelValue('Produk', order.productName, 95, 720);
    drawLabelValue('Metode', orderMethod, 480, 720);

    drawLabelValue('Status', getStatusLabel(order.status), 95, 830);
    drawLabelValue('Total Harga', formatPrice(order.productPrice), 480, 830);

    drawLabelValue(
      orderMethod === 'Dikirim / COD' ? 'Pengiriman' : 'Tanggal Ambil',
      orderMethod === 'Dikirim / COD'
        ? '1 hari setelah checkout'
        : formatPickupDate(order.pickupDate),
      95,
      940
    );

    ctx.fillStyle = '#F8FAFC';
    drawRoundRect(95, 1030, 710, 120, 16);

    ctx.fillStyle = '#8A8A8A';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('CATATAN', 125, 1070);

    ctx.fillStyle = '#1E293B';
    ctx.font = '21px Arial';
    drawWrappedText(cleanNote || '-', 125, 1110, 650, 30);

    ctx.fillStyle = '#FDF2F4';
    drawRoundRect(95, 1185, 710, 85, 16);

    ctx.fillStyle = '#C95F7C';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Terima kasih sudah memesan di Yuna Florist', 125, 1225);

    ctx.fillStyle = '#64748B';
    ctx.font = '18px Arial';
    ctx.fillText('Simpan nota ini sebagai bukti pesanan Anda.', 125, 1253);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
      'WA: 085768300253 • IG: Yuna Florist Adiluwih • TT: Yuna Florist Adiluwih',
      canvas.width / 2,
      1310
    );

    ctx.textAlign = 'left';

    const link = document.createElement('a');
    link.download = `nota-${orderCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Pesanan</h2>
          <p className="text-sm text-slate-400">
            Pantau semua pesanan masuk dari WhatsApp katalog.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama, produk, atau kode pesanan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-pink-dark outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          {[
            'all',
            'New',
            'Processing',
            'Completed',
            'CancelRequested',
            'CancelRejected',
            'Cancelled'
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'flex-shrink-0 px-3 py-2 rounded-lg text-[11px] font-bold transition-all border',
                filterStatus === status
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-pink-dark transition-all'
              )}
            >
              {status === 'all' ? 'Semua' : getStatusLabel(status as Order['status'])}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
          ))
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const orderCode = getSafeOrderCode(order);
            const orderMethod = getOrderMethod(order);
            const cleanNote = getCleanNote(order);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden flex flex-col group"
              >
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {orderCode}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(orderCode);
                          alert('Kode pesanan berhasil disalin.');
                        }}
                        className="text-slate-400 hover:text-brand-pink-dark transition-all"
                        title="Salin kode pesanan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                      getStatusColor(order.status)
                    )}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="p-6 flex-grow space-y-5">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 mb-1">
                      {order.productName}
                    </h4>
                    <p className="text-brand-pink-dark font-bold text-sm tracking-tight">
                      {formatPrice(order.productPrice)}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-bold text-slate-700">
                        {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-300" />
                      <a
                        href={`https://wa.me/${formatWhatsAppNumber(
                          order.customerWhatsapp
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                      >
                        {order.customerWhatsapp} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-medium text-slate-500">
                        Metode Pesanan: {orderMethod}
                      </span>
                    </div>

                    {orderMethod === 'Ambil di Tempat' && (
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-slate-300" />
                        <span className="text-xs font-medium text-slate-500">
                          Tanggal Ambil: {formatPickupDate(order.pickupDate)}
                        </span>
                      </div>
                    )}

                    {orderMethod === 'Dikirim / COD' && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span className="text-xs font-medium text-slate-500">
                          Pengiriman: 1 hari setelah checkout
                        </span>
                      </div>
                    )}
                  </div>

                  {orderMethod === 'Dikirim / COD' && order.deliveryAddress && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Alamat Pengiriman:
                      </p>
                      <p className="text-xs text-slate-600 whitespace-pre-line">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  )}

                  {orderMethod === 'Dikirim / COD' && order.deliveryLocationUrl && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Lokasi:
                      </p>
                      <a
                        href={order.deliveryLocationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Lihat Lokasi Pengiriman
                      </a>
                    </div>
                  )}

                  {cleanNote && (
                    <div className="p-3 bg-brand-cream/50 rounded-lg border border-brand-pink-dark/5">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                        <StickyNote className="w-3 h-3" />
                        Catatan:
                      </p>
                      <p className="text-xs text-slate-600 italic whitespace-pre-line">
                        "{cleanNote}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto">
                  {order.status === 'New' && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'Processing')}
                      className="flex-grow bg-blue-500 text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" /> Proses
                    </button>
                  )}

                  {order.status === 'Processing' && (
                    <button
                      onClick={() => handleStatusChange(order.id!, 'Completed')}
                      className="flex-grow bg-green-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </button>
                  )}

                  {order.status === 'Completed' && (
                    <button
                      type="button"
                      onClick={() => handleContactCustomer(order)}
                      className="w-full bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Hubungi Pembeli
                    </button>
                  )}

                  {order.status === 'CancelRequested' && (
                    <div className="p-5 bg-orange-50 border-t border-orange-100 w-full">
                      <p className="text-xs font-bold text-orange-700 mb-3">
                        Pelanggan mengajukan pembatalan pesanan.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleStatusChange(order.id!, 'Cancelled')}
                          className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-all"
                        >
                          Setujui Batal
                        </button>

                        <button
                          onClick={() => handleStatusChange(order.id!, 'CancelRejected')}
                          className="flex-1 bg-slate-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-all"
                        >
                          Tolak Pembatalan
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDownloadReceipt(order)}
                    className="flex-1 bg-brand-sage text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-brand-sage/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Nota
                  </button>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Pesanan
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-100">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium italic">
              Belum ada pesanan yang sesuai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}