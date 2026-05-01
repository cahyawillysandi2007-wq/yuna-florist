import React, { useState, useEffect } from 'react';
import {
  Save,
  Store,
  Phone,
  Instagram,
  Facebook,
  MapPin,
  Clock,
  FileText,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { StoreSettings } from '../types';
import { useForm } from 'react-hook-form';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    async function loadSettings() {
      try {
        const ref = doc(db, 'store_settings', 'default');
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          reset(snapshot.data() as StoreSettings);
        } else {
          reset({
            storeName: 'Yuna Florist Adiluwih',
            whatsappNumber: '085768300253',
            instagram: 'yunafloristadiluwih',
            facebook: 'Yuna Florist Adiluwih',
            address: 'Adiluwih, Pringsewu, Lampung',
            openingHours: '08:00 - 20:00',
            description: 'Buket cantik untuk momen spesial Anda.',
            logoUrl: ''
          });
        }
      } catch (error) {
        console.error(error);
        alert('Gagal memuat pengaturan toko.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    setSuccess(false);

    try {
      const settings: StoreSettings = {
        storeName: data.storeName || 'Yuna Florist Adiluwih',
        whatsappNumber: data.whatsappNumber || '085768300253',
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        address: data.address || '',
        openingHours: data.openingHours || '',
        description: data.description || '',
        logoUrl: data.logoUrl || ''
      };

      await setDoc(doc(db, 'store_settings', 'default'), settings);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan pengaturan. Cek Firestore Rules.');
    } finally {
      setSaving(false);
    }
  };

  const logoUrl = watch('logoUrl');

  if (loading) {
    return <div className="p-20 text-center animate-pulse">Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pengaturan Toko</h2>
        <p className="text-sm text-slate-400">Kelola identitas brand dan informasi kontak Yuna Florist.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="relative aspect-square rounded-xl bg-white shadow-soft border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center text-slate-400">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Toko" className="w-full h-full object-cover p-2" />
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">
                    Preview Logo Toko
                  </span>
                </>
              )}
            </div>

            <div className="bg-brand-pink p-5 rounded-xl border border-brand-pink-dark/10">
              <h4 className="text-xs font-black text-brand-pink-dark uppercase mb-2">
                Catatan
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                Karena versi gratis tidak memakai Firebase Storage, logo toko menggunakan link gambar.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-soft border border-slate-100 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Link Logo Toko
                </label>
                <input
                  {...register('logoUrl')}
                  placeholder="https://contoh.com/logo-yuna-florist.png"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Store className="w-3.5 h-3.5" /> Nama Toko
                </label>
                <input
                  {...register('storeName', { required: true })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Business
                  </label>
                  <input
                    {...register('whatsappNumber', { required: true })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Jam Operasional
                  </label>
                  <input
                    {...register('openingHours')}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5" /> Instagram Username
                  </label>
                  <input
                    {...register('instagram')}
                    placeholder="yunafloristadiluwih"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Facebook className="w-3.5 h-3.5" /> Facebook Page
                  </label>
                  <input
                    {...register('facebook')}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Alamat Lengkap
                </label>
                <textarea
                  {...register('address')}
                  rows={2}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Deskripsi Toko
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Ceritakan sejarah singkat atau filosofi toko bunga Anda..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none text-sm italic resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-5 pt-4">
              {success && (
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" /> Pengaturan Tersimpan!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-slate-800 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Simpan Perubahan <Save className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}