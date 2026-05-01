import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Flower2, Lock, Mail, ChevronLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Email atau password salah. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-brand-pink relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 floral-pattern opacity-30" />
        <div className="relative z-10 max-w-md text-center">
            <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg border border-white/50">
               <Flower2 className="w-12 h-12 text-brand-pink-dark" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-slate-800 mb-6">Kelola Toko Anda dengan Mudah</h1>
            <p className="text-slate-500 leading-relaxed italic">
              "Bunga adalah musik bumi, dan Admin Panel adalah konduktornya."
            </p>
        </div>
        <div className="absolute bottom-10 left-10 text-brand-pink-dark font-bold text-sm tracking-widest uppercase">
           Yuna Florist Adiluwih &copy; 2026
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-20 relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-brand-pink-dark transition-colors group">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-pink-dark">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Kembali ke Beranda</span>
        </Link>

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-soft border border-brand-pink-dark/5">
          <div className="text-center mb-10 lg:hidden">
             <Flower2 className="w-10 h-10 text-brand-pink-dark mx-auto mb-2" />
             <h2 className="font-serif text-2xl font-bold text-brand-sage">Admin Login</h2>
          </div>

          <div className="hidden lg:block mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang, Owner!</h2>
             <p className="text-slate-400 text-sm">Silakan masuk untuk mengelola katalog buket Anda.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-slate-800"
                placeholder="admin@yunaflorist.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark focus:outline-none transition-all text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-800 text-white py-4 rounded-lg font-bold shadow-lg hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-slate-300 uppercase tracking-widest">
            Protected by Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
