import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, generateWhatsAppLink, generateOrderCode } from '../lib/utils';
import { orderService } from '../services/orderService';
import { storeSettingsService } from '../services/storeSettingsService';

export default function Cart() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [note, setNote] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successOrderCode, setSuccessOrderCode] = useState('');
  
  const formatDateID = (dateString: string) => {
  if (!dateString) return '-';

  if (dateString.includes('/')) return dateString;

  const [year, month, day] = dateString.split('-');

  if (!year || !month || !day) return dateString;

  return `${day}/${month}/${year}`;
};
  const handleCheckout = async (e: React.FormEvent) => {
  e.preventDefault();

  if (items.length === 0) {
    alert('Keranjang masih kosong.');
    return;
  }

  if (!customerName || !customerWhatsapp || !pickupDate) {
    alert('Nama, nomor WhatsApp, dan tanggal ambil/kirim wajib diisi.');
    return;
  }

  setCheckoutLoading(true);

  try {
    const settings = await storeSettingsService.getSettings();

    const productListText = items
      .map((item, index) => {
        return `${index + 1}. ${item.name}
   Jumlah: ${item.quantity}
   Harga: ${formatPrice(item.price)}
   Subtotal: ${formatPrice(item.price * item.quantity)}`;
      })
      .join('\n\n');

    const orderNote = note || '-';

    const firstItem = items[0];

    const orderId = await orderService.createOrder({
      customerName,
      customerWhatsapp,
      productId: firstItem.productId,
      productName: items.length === 1 ? firstItem.name : `${items.length} Produk dalam Keranjang`,
      productPrice: totalPrice,
      note: orderNote,
      pickupDate: formatDateID(pickupDate),
      status: 'New'
    });

    const newOrderCode = generateOrderCode(orderId);
    setSuccessOrderCode(newOrderCode);

    const whatsappMessage = `Halo kak, saya ingin pesan produk dari ${settings.storeName}.

Nama Pemesan: ${customerName}
No WhatsApp: ${customerWhatsapp}
Tanggal Ambil/Kirim: ${formatDateID(pickupDate)}

Produk:
${productListText}

Total: ${formatPrice(totalPrice)}

Catatan:
${note || '-'}`;

    const waLink = generateWhatsAppLink(settings.whatsappNumber, whatsappMessage);

    clearCart();

    setCustomerName('');
    setCustomerWhatsapp('');
    setPickupDate('');
    setNote('');

    window.open(waLink, '_blank');

  } catch (error) {
    console.error(error);
    alert('Gagal checkout. Cek koneksi Firebase atau Firestore Rules.');
  } finally {
    setCheckoutLoading(false);
  }
};

  if (successOrderCode) {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-soft border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="font-serif text-3xl font-bold text-slate-800 mb-2">
          Pesanan Berhasil Dibuat
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Simpan kode pesanan ini untuk cek status pesanan Anda.
        </p>

        <div className="bg-brand-pink border border-brand-pink-dark/20 rounded-xl p-5 mb-5">
          <p className="text-xs font-bold text-brand-pink-dark uppercase tracking-widest mb-2">
            Kode Pesanan
          </p>

          <p className="text-3xl font-black text-slate-800 tracking-wider">
            {successOrderCode}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(successOrderCode);
            alert('Kode pesanan berhasil disalin.');
          }}
          className="w-full bg-brand-sage text-white py-3.5 rounded-lg font-bold hover:bg-brand-sage/90 transition-all mb-3"
        >
          Salin Kode Pesanan
        </button>

        <a
          href="/orders"
          className="block w-full bg-brand-pink-dark text-white py-3.5 rounded-lg font-bold hover:opacity-90 transition-all"
        >
          Cek Status Pesanan
        </a>

        <p className="text-[11px] text-slate-400 mt-4">
          Kode ini juga akan digunakan sebagai nomor pesanan.
        </p>
      </div>
    </div>
  );
}

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-soft border border-slate-100 p-8 text-center">
          <div className="w-14 h-14 rounded-lg bg-brand-pink flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-7 h-7 text-brand-pink-dark" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-slate-800 mb-2">
            Keranjang Kosong
          </h1>

          <p className="text-slate-500 text-sm mb-6">
            Belum ada produk yang dimasukkan ke keranjang.
          </p>

          <Link
            to="/catalog"
            className="inline-flex items-center justify-center bg-brand-pink-dark text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Lihat Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-pink-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Lanjut Belanja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-slate-800">
                Keranjang
              </h1>
              <p className="text-sm text-slate-500">
                Ada {totalItems} item di keranjang Anda.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 border-b border-slate-100 last:border-b-0 flex gap-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">
                      {item.name}
                    </h3>

                    <p className="text-sm font-bold text-brand-pink-dark mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.productId)}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-bold text-slate-700">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.productId)}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="text-sm font-bold text-red-500 hover:underline"
            >
              Kosongkan Keranjang
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6 lg:sticky lg:top-24">
              <h2 className="font-bold text-slate-800 text-lg mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total Item</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total Harga</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="mt-5 space-y-3">
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
      Nama Pemesan
    </label>
    <input
      type="text"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      placeholder="Nama lengkap"
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-pink-dark"
    />
  </div>

  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
      Nomor WhatsApp
    </label>
    <input
      type="text"
      value={customerWhatsapp}
      onChange={(e) => setCustomerWhatsapp(e.target.value)}
      placeholder="08xxxxxxxxxx"
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-pink-dark"
    />
  </div>

  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
      Tanggal Ambil/Kirim
    </label>
   <input
  type="date"
  value={pickupDate}
  onChange={(e) => setPickupDate(e.target.value)}
  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-pink-dark"
/>
  </div>

  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
      Catatan Tambahan
    </label>
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Contoh: warna pink soft, tulisan ucapan, jam ambil..."
      rows={3}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-pink-dark resize-none"
    />
  </div>

  <button
    type="submit"
    disabled={checkoutLoading}
    className="w-full bg-brand-pink-dark text-white py-3.5 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
  >
    <MessageCircle className="w-5 h-5" />
    {checkoutLoading ? 'Memproses...' : 'Checkout via WhatsApp'}
  </button>

  <p className="text-[11px] text-slate-400 text-center">
    Pesanan akan masuk ke admin dan pelanggan diarahkan ke WhatsApp owner.
  </p>
</form>
              <p className="text-[11px] text-slate-400 text-center mt-3">
                Setelah checkout, pesanan akan masuk ke admin dan WhatsApp owner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}