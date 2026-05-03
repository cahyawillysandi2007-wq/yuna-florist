import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Lock,
  Mail,
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Flower2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';

const logoUrl =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1xDww38oZcqtfixtgaEQd-ddAxuQeXeu1Xe_jkLyQi_whAqBIDROZ0fxu3qy0pu31z6dNJEr0ioFX2jTh8jJI3ZbuB7sI_MeKdDsng37bXMhLMrKxokMASD-x-cn7aycau-CACl20V8fm8kV2d7pTYYMOrjAtMqRe3tOjplO3dFUpqjLTzLLtAFnxyYs/s320/ChatGPT%20Image%20May%201,%202026,%2003_58_20%20PM.png';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fffaf8]">
      {/* Soft Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-28 w-80 h-80 bg-brand-pink/50 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-brand-sage/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-brand-pink-dark/10 rounded-full blur-3xl" />

        <div className="absolute top-20 right-20 hidden lg:block text-brand-pink-dark/10">
          <Flower2 className="w-40 h-40 rotate-12" />
        </div>

        <div className="absolute bottom-20 left-16 hidden lg:block text-brand-sage/10">
          <Flower2 className="w-52 h-52 -rotate-12" />
        </div>
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left Visual */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-slate-500 hover:text-brand-pink-dark transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:border-brand-pink-dark/30">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Kembali ke Beranda</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-brand-pink-dark/10 shadow-soft mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 overflow-hidden">
                <img
                  src={logoUrl}
                  alt="Yuna Florist"
                  className="w-full h-full object-contain p-1"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-brand-sage">
                  Yuna Florist Adiluwih
                </p>
                <p className="text-[10px] uppercase tracking-widest text-brand-pink-dark font-bold">
                  Florist & Gift
                </p>
              </div>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl leading-tight font-bold text-slate-800 mb-6">
              Kelola toko
              <span className="block text-brand-pink-dark italic">
                lebih mudah.
              </span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Masuk ke dashboard owner untuk mengelola produk, kategori,
              pesanan, stok, nota, dan pengaturan toko Yuna Florist.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-soft"
              >
                <ShieldCheck className="w-8 h-8 text-brand-sage mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Aman</h3>
                <p className="text-sm text-slate-500">
                  Login terhubung dengan Firebase Authentication.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/80 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-soft"
              >
                <Sparkles className="w-8 h-8 text-brand-pink-dark mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Praktis</h3>
                <p className="text-sm text-slate-500">
                  Semua pengelolaan toko ada dalam satu dashboard.
                </p>
              </motion.div>
            </div>
          </motion.div>

          <p className="text-sm text-slate-400">
            © 2026 Yuna Florist Adiluwih
          </p>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-5">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-pink-dark transition-colors"
              >
                <div className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Kembali</span>
              </Link>
            </div>

            <div className="bg-white/95 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_24px_70px_rgba(15,23,42,0.10)] overflow-hidden">
              <div className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r from-brand-pink/25 via-white to-brand-cream border-b border-slate-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-white shadow-soft border border-slate-100 flex items-center justify-center overflow-hidden mb-4">
                    <img
                      src={logoUrl}
                      alt="Yuna Florist"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-slate-800">
                    Admin Login
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Masuk untuk mengelola toko Yuna Florist
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-7">
                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="Masukkan email admin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-pink-dark focus:bg-white focus:ring-4 focus:ring-brand-pink/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 pr-14 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-pink-dark focus:bg-white focus:ring-4 focus:ring-brand-pink/20"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-pink-dark transition-colors"
                        aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-brand-pink-dark text-white font-bold text-base shadow-lg shadow-pink-200 transition-all hover:bg-brand-pink-dark/90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Masuk ke Dashboard
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 flex gap-2 rounded-xl bg-brand-cream/70 border border-brand-pink-dark/10 px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Khusus owner/admin yang sudah terdaftar.
              </p>
            </div>

                <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  Protected by CWS VORTEX
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}