import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  MapPin,
  CheckCircle2,
  Tag,
  Info,
  Flower2,
  ShoppingCart
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartFeedback, setCartFeedback] = useState(false);

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

  const isOutOfStock =
    !product || (product.stock ?? 0) <= 0 || product.isAvailable === false;

  const handleAddToCartOnly = () => {
    if (!product) return;

    if (isOutOfStock) {
      alert('Maaf, produk ini sedang habis.');
      return;
    }

    addToCart(product);
    setCartFeedback(true);

    setTimeout(() => {
      setCartFeedback(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (isOutOfStock) {
      alert('Maaf, produk ini sedang habis.');
      return;
    }

    addToCart(product);
    navigate('/cart');
  };

  const handleShare = () => {
    if (!product) return;

    if (navigator.share) {
      navigator.share({
        title: `Yuna Florist - ${product.name}`,
        text: `Lihat buket cantik ini di Yuna Florist Adiluwih!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link produk berhasil disalin.');
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
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">
          Produk tidak ditemukan
        </h2>

        <Link
          to="/catalog"
          className="text-brand-pink-dark font-bold hover:underline"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-pink-dark transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
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
                src={
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1522673607200-16488352475b?q=80&w=800&auto=format&fit=crop'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest">
                  Produk Habis
                </span>
              </div>
            )}
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

            {cartFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700"
              >
                Produk berhasil dimasukkan ke keranjang.
              </motion.div>
            )}

            <div className="grid grid-cols-[1fr_auto] gap-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-brand-pink-dark text-white py-4 rounded-xl font-bold shadow-soft hover:bg-brand-pink-dark/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? 'Produk Habis' : 'Beli Sekarang'}
              </button>

              <button
                type="button"
                onClick={handleAddToCartOnly}
                disabled={isOutOfStock}
                className="w-14 h-14 rounded-xl border border-brand-pink-dark/20 bg-white text-brand-pink-dark flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Masukkan ke Keranjang"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-full bg-white border border-brand-pink-dark/20 rounded-xl py-3 flex items-center justify-center gap-2 text-brand-pink-dark font-bold hover:bg-brand-pink transition-all"
              title="Bagikan"
            >
              <Share2 className="w-5 h-5" />
              Bagikan Produk
            </button>

            <div className="flex items-center justify-center gap-1.5 opacity-40 pt-2">
              <Flower2   className="w-3 h-3" />
              <span className="text-[8px] uppercase tracking-widest font-black">
                Yuna Florist Quality Seal
              </span>
              <Flower2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}