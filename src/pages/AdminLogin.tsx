import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Flower2,
  Lock,
  Mail,
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { auth } from '../lib/firebase';

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
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-pink/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-brand-sage/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-pink-dark/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-pink-dark transition-colors"
            >
              <div className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">Kembali ke Beranda</span>
            </Link>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-brand-pink-dark/10 shadow-soft mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-brand-pink-dark" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Yuna Florist Admin</p>
                <p className="text-xs text-slate-500">Panel pengelolaan toko</p>
              </div>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl leading-tight font-bold text-slate-800 mb-5">
              Login Admin
              <span className="block text-brand-pink-dark">lebih elegan & nyaman</span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Masuk ke dashboard untuk mengelola produk, kategori, pesanan, dan pengaturan toko
              Yuna Florist dengan tampilan yang lebih rapi dan modern.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">
              <div className="bg-white/80 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-soft">
                <ShieldCheck className="w-8 h-8 text-brand-sage mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Aman</h3>
                <p className="text-sm text-slate-500">
                  Login memakai Firebase Authentication.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-soft">
                <Sparkles className="w-8 h-8 text-brand-pink-dark mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Praktis</h3>
                <p className="text-sm text-slate-500">
                  Kelola produk dan pesanan dalam satu tempat.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-400">
            © 2026 Yuna Florist Adiluwih
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            {/* Mobile top back */}
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

            <div className="bg-white/90 backdrop-blur-md border border-white/70 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
              {/* Top header */}
              <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-r from-brand-pink/20 via-white to-brand-cream">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-pink flex items-center justify-center shadow-sm">
                    <Flower2 className="w-7 h-7 text-brand-pink-dark" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
                      Admin Login
                    </h2>
                    <p className="text-sm text-slate-500">
                      Silakan masuk ke dashboard toko
                    </p>
                  </div>
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

                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Masukkan email admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 pr-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-pink-dark focus:bg-white focus:ring-4 focus:ring-brand-pink/20"
                      />
                    </div>
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
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-base shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Masuk ke Dashboard'
                    )}
                  </button>
                </form>

                <div className="mt-6 rounded-2xl bg-brand-cream border border-brand-pink-dark/10 px-4 py-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Gunakan akun admin yang sudah terdaftar di Firebase Authentication.
                  </p>
                </div>

                <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  Protected by Firebase Authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}