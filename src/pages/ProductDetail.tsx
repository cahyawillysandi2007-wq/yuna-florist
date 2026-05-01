import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Tag,
  Info,
  ChevronLeft,
  Flower2,
  ShoppingCart
} from 'lucide-react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product } from '../types';
import { formatPrice, generateWhatsAppLink, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerWA, setCustomerWA] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [note, setNote] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);
  const handleAddToCart = () => {
  if (!product) return;

  addToCart(product);
};

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setOrderSubmitting(true);
    try {
      // Save to Firebase
      await orderService.createOrder({
        customerName,
        customerWhatsapp: customerWA,
        productId: product.id!,
        productName: product.name,
        productPrice: product.price,
        note,
        pickupDate,
        status: 'New'
      });

      // Prepare Whatsapp Message
      const message = `Halo Yuna Florist, saya ingin pesan produk:

*${product.name}*
Harga: ${formatPrice(product.price)}

Nama Pemesan: ${customerName}
WA: ${customerWA}
Tanggal Ambil/Kirim: ${pickupDate}
Catatan: ${note || '-'}

Terima kasih.`;

      const waLink = generateWhatsAppLink('085768300253', message);
      window.open(waLink, '_blank');
      
      // Feedback & Reset
      setShowOrderForm(false);
      alert('Pesanan Anda telah dikirim! Anda akan diarahkan ke WhatsApp.');
    } catch (error) {
      console.error('Order failed', error);
      alert('Maaf, pemesanan gagal. Silakan coba lagi.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-pink-dark border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Produk tidak ditemukan</h2>
        <Link to="/catalog" className="text-brand-pink-dark font-bold hover:underline">Kembali ke Katalog</Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/50 min-h-screen pb-20">
      {/* Mobile Back Button */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-pink-dark transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-white bg-white">
              <img 
                src={product.imageUrl || 'https://images.unsplash.com/photo-1522673607200-16488352475b?q=80&w=800&auto=format&fit=crop'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
          </div>
          </motion.div>

{/* Info Section */}
<div className="bg-white rounded-xl border border-slate-100 shadow-soft p-5 md:p-7 flex flex-col gap-6">
  <div>
    <div className="flex items-center gap-2 text-brand-pink-dark text-xs font-bold uppercase tracking-widest mb-3">
      <Tag className="w-3.5 h-3.5" />
      <span>{product.categoryName}</span>
    </div>

    <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
      {product.name}
    </h1>

    <p className="text-2xl md:text-3xl font-bold text-brand-pink-dark mt-4">
      {formatPrice(product.price)}
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-slate-100">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center text-brand-sage shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Ketersediaan
        </p>

        <p
          className={cn(
            'text-sm font-bold mt-1',
            (product.stock ?? 0) <= 0
              ? 'text-red-500'
              : (product.stock ?? 0) <= 3
              ? 'text-orange-500'
              : 'text-green-600'
          )}
        >
          {(product.stock ?? 0) <= 0
            ? 'Habis'
            : (product.stock ?? 0) <= 3
            ? `Stok Menipis (${product.stock} tersisa)`
            : `Ready (${product.stock} tersedia)`}
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center text-brand-pink-dark shrink-0">
        <MapPin className="w-5 h-5" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Lokasi
        </p>
        <p className="text-sm font-bold text-slate-800 mt-1">
          Yuna Florist Adiluwih
        </p>
      </div>
    </div>
  </div>

  <div>
    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
      <Info className="w-4 h-4 text-brand-sage" />
      Deskripsi Produk
    </h4>

    <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
      {product.description || 'Tidak ada deskripsi untuk produk ini.'}
    </p>
  </div>

  {product.eventTags && product.eventTags.length > 0 && (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        Cocok Untuk
      </p>

      <div className="flex flex-wrap gap-2">
        {product.eventTags.map((tag) => (
          <span
            key={tag}
            className="bg-brand-pink px-3 py-1 rounded-lg text-[10px] font-bold text-brand-pink-dark uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )}

  <div className="flex flex-col sm:flex-row gap-3 pt-2">
    <button
      type="button"
      onClick={() => {
        handleAddToCart();
        navigate('/cart');
      }}
      disabled={(product.stock ?? 0) <= 0}
      className="flex-grow bg-brand-sage text-white py-4 rounded-lg font-bold shadow-soft flex items-center justify-center gap-2 hover:bg-brand-sage/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-5 h-5" />
      {(product.stock ?? 0) > 0 ? 'Tambah ke Keranjang' : 'Produk Habis'}
    </button>

    <button
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: `Yuna Florist - ${product.name}`,
            text: `Lihat buket cantik ini di Yuna Florist Adiluwih!`,
            url: window.location.href,
          });
        }
      }}
      className="w-full sm:w-16 h-14 bg-white border border-brand-pink-dark/20 rounded-lg flex items-center justify-center text-brand-pink-dark hover:bg-brand-pink transition-all"
      title="Bagikan"
    >
      <Share2 className="w-5 h-5" />
    </button>
  </div>
</div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-pink-dark via-brand-sage to-brand-gold opacity-50" />
              
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-800 tracking-tight">Form Pemesanan</h3>
                    <p className="text-xs text-slate-400 font-medium italic mt-1">Lengkapi data untuk pesanan {product.name}</p>
                 </div>
                 <button 
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                 >
                    <ArrowLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                 </button>
              </div>

              <form onSubmit={handleOrder} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1 italic">Nama Anda</label>
                   <input 
                      type="text" 
                      required
                      placeholder="Contoh: Rina Sari"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-sm font-medium"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1 italic">Nomor WhatsApp</label>
                   <input 
                      type="tel" 
                      required
                      placeholder="Contoh: 0857XXXXXXXX"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-sm font-medium"
                      value={customerWA}
                      onChange={(e) => setCustomerWA(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1 italic flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tanggal Pengambilan / Kirim
                   </label>
                   <input 
                      type="date" 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-sm font-medium"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1 italic">Catatan Khusus (Optional)</label>
                   <textarea 
                      rows={3}
                      placeholder="Contoh: Warna tema pink soft, tambah kartu ucapan 'Happy Graduation'..."
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-sm font-medium resize-none"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                   />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={orderSubmitting}
                    className="flex-[2] bg-brand-pink-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-100 flex items-center justify-center gap-2 hover:bg-brand-pink-dark/90 transition-all disabled:opacity-70"
                  >
                    {orderSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Kirim Pesanan <MessageCircle className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 flex items-center justify-center gap-1.5 opacity-40">
                 <Flower2 className="w-3 h-3" />
                 <span className="text-[8px] uppercase tracking-widest font-black">Yuna Florist Quality Seal</span>
                 <Flower2 className="w-3 h-3" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
