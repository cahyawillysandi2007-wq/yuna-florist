import React, { useEffect, useState } from 'react';
import {
  Flower2,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Music2
} from 'lucide-react';
import { StoreSettings } from '../types';
import { storeSettingsService } from '../services/storeSettingsService';

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await storeSettingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Gagal memuat footer settings:', error);
      }
    }

    loadSettings();
  }, []);

  const data = settings || {
    storeName: 'Yuna Florist Adiluwih',
    whatsappNumber: '085768300253',
    instagram: 'yunafloristadiluwih',
    facebook: 'Yuna Florist Adiluwih',
    tiktok: 'yunafloristadiluwih',
    address: 'Adiluwih, Pringsewu, Lampung',
    openingHours: '08:00 - 20:00',
    description: 'Buket cantik untuk momen spesial Anda.',
    logoUrl: ''
  };

  const tiktokUsername = (data as any).tiktok || 'yunafloristadiluwih';

  return (
    <footer className="bg-white border-t border-brand-pink-dark/10 mt-16">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt={data.storeName}
                  className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-brand-pink flex items-center justify-center text-brand-pink-dark">
                  <Flower2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <h3 className="font-serif text-lg font-bold text-brand-sage leading-none">
                  {data.storeName}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-pink-dark font-bold">
                  Florist & Gift
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              {data.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">
              Informasi Toko
            </h4>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{data.address}</span>
              </div>

              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{data.openingHours}</span>
              </div>

              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{data.whatsappNumber}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">
              Sosial Media
            </h4>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex gap-3">
                <Instagram className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{data.instagram}</span>
              </div>

              <div className="flex gap-3">
                <Facebook className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{data.facebook}</span>
              </div>

              <div className="flex gap-3">
                <Music2 className="w-4 h-4 text-brand-pink-dark shrink-0 mt-0.5" />
                <span>{tiktokUsername}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {data.storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}