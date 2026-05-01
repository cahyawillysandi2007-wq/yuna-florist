import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Gift,
  Heart,
  MessageCircle,
  Wallet,
  Palette,
  PackageCheck,
  Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [latestProducts, activeCategories] = await Promise.all([
          productService.getLatestProducts(6),
          categoryService.getActiveCategories()
        ]);

        setProducts(latestProducts);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const whyChooseUs = [
    {
      icon: Palette,
      title: 'Bisa Custom Buket',
      description: 'Pelanggan bisa request model, warna, isi, dan tema buket sesuai kebutuhan.'
    },
    {
      icon: Wallet,
      title: 'Sesuai Budget',
      description: 'Pesanan bisa disesuaikan dengan budget tanpa mengurangi kesan spesial.'
    },
    {
      icon: PackageCheck,
      title: 'Banyak Pilihan',
      description: 'Tersedia buket wisuda, ulang tahun, snack, uang, hadiah, dan pilihan lainnya.'
    },
    {
      icon: Smartphone,
      title: 'Pemesanan Mudah',
      description: 'Pelanggan bisa melihat katalog, memasukkan ke keranjang, dan checkout via WhatsApp.'
    }
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-28 px-4">
        <div className="absolute top-10 right-0 w-72 h-72 bg-brand-pink-dark/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sage/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-brand-pink border border-brand-pink-dark/10 px-4 py-1.5 rounded-full self-center lg:self-start mb-2">
              <Sparkles className="w-4 h-4 text-brand-pink-dark" />
              <span className="text-xs font-bold text-brand-pink-dark uppercase tracking-wider">
                Momen Spesial Makin Berkesan
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-slate-800 tracking-tight">
              Buket Cantik untuk <span className="text-brand-pink-dark italic">Momen Spesial</span>
            </h1>

            <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Yuna Florist menyediakan buket wisuda, ulang tahun, snack, uang, dan custom dengan tampilan cantik, rapi, dan berkesan.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-3">
              <Link
                to="/catalog"
                className="w-full sm:w-auto bg-brand-pink-dark text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:bg-brand-pink-dark/90 transition-all hover:scale-105 active:scale-95"
              >
                Lihat Katalog <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                to="/help-me-choose"
                className="w-full sm:w-auto bg-white border border-brand-pink-dark/20 text-brand-pink-dark px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-pink transition-all"
              >
                Bantu Pilih Buket <Flower2 className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-brand-pink-dark/10">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 text-sm md:text-lg">Custom</span>
                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">Sesuai Request</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 text-sm md:text-lg">Praktis</span>
                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">Order via WA</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 text-sm md:text-lg">Estetik</span>
                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold">Rapi & Cantik</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="relative hidden lg:block"
          >
            <motion.div
              whileHover={{
                scale: 1.035,
                rotate: 0,
                y: -8
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 16
              }}
              className="relative z-10 rounded-xl overflow-hidden border-8 border-white shadow-2xl rotate-2 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop"
                alt="Yuna Florist Showcase"
                className="w-full h-[550px] object-cover transition-transform duration-500"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-brand-pink rounded-full -z-10 border-4 border-white shadow-lg"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="absolute bottom-5 left-5 bg-white rounded-xl shadow-soft border border-slate-100 px-5 py-4 flex items-center gap-3 z-20"
            >
              <div className="w-11 h-11 rounded-lg bg-brand-pink flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-brand-pink-dark" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Buket Custom
                </p>
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  Bisa Request <br /> Sesuai Keinginan
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
              <section className="container mx-auto px-4 md:px-6">
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="mb-7 text-center md:text-left"
  >
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-pink text-brand-pink-dark text-[11px] font-bold uppercase tracking-wider mb-3">
      <Sparkles className="w-3.5 h-3.5" />
      Keunggulan Kami
    </span>

    <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
      Kenapa Harus Kami?
    </h2>

    <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl mx-auto md:mx-0 leading-relaxed">
      Yuna Florist membantu Anda memilih buket yang cantik, rapi, dan sesuai kebutuhan untuk setiap momen spesial.
    </p>
  </motion.div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
    {whyChooseUs.map((item, index) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.32,
          delay: index * 0.04,
          ease: 'easeOut'
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 }
        }}
        className="group bg-white rounded-xl border border-slate-100 shadow-soft p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-pink-dark/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-brand-pink flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <item.icon className="w-5 h-5 text-brand-pink-dark" />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 mb-1.5">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-brand-pink/30 rounded-xl px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-end justify-between mb-10 text-center sm:text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-800">
                Koleksi Terbaru
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Produk-produk favorit pilihan pelanggan
              </p>
            </div>

            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-2 text-brand-pink-dark font-bold hover:underline"
            >
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/50 animate-pulse rounded-lg aspect-[4/6]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-brand-pink-dark/20">
              <p className="text-slate-400 italic">
                Belum ada produk untuk ditampilkan.
              </p>
            </div>
          )}

          <div className="mt-10 block sm:hidden">
            <Link
              to="/catalog"
              className="w-full bg-white border border-brand-pink-dark/20 text-brand-pink-dark py-4 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              Lihat Semua Produk <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="flex gap-4 p-6 bg-white rounded-xl border border-brand-pink-dark/5 shadow-soft"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-pink flex items-center justify-center text-brand-pink-dark shrink-0">
            <Heart className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">Premium Quality</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bahan pilihan berkualitas tinggi untuk hasil buket yang maksimal.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          whileHover={{ y: -5 }}
          className="flex gap-4 p-6 bg-white rounded-xl border border-brand-pink-dark/5 shadow-soft"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-brand-sage shrink-0">
            <Gift className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">Custom Order</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sesuaikan isi dan warna buket sesuai keinginan Anda.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          whileHover={{ y: -5 }}
          className="flex gap-4 p-6 bg-white rounded-xl border border-brand-pink-dark/5 shadow-soft"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">Fast Response</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admin ramah dan responsif membantu pesanan Anda via WhatsApp.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Help Me Choose Banner */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-brand-sage rounded-xl overflow-hidden relative p-8 md:p-14">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12" />

          <div className="max-w-xl relative z-10 text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Bingung mau pilih buket yang mana?
            </h2>

            <p className="text-brand-sage-light text-base md:text-lg mb-8 leading-relaxed">
              Gunakan fitur rekomendasi untuk menemukan buket yang cocok sesuai budget, acara, dan warna favorit Anda.
            </p>

            <Link
              to="/help-me-choose"
              className="inline-flex bg-white text-brand-sage px-8 py-4 rounded-lg font-bold shadow-xl hover:bg-brand-cream transition-all hover:scale-105"
            >
              Coba Rekomendasi Pintar
            </Link>
          </div>

          <div className="absolute right-12 bottom-0 hidden lg:block">
            <Flower2 className="w-64 h-64 text-white/10 -rotate-12" />
          </div>
        </div>
      </section>
    </div>
  );
}