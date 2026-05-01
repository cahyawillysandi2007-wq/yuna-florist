import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Flower2, ShoppingCart, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import { StoreSettings } from '../types';
import { storeSettingsService } from '../services/storeSettingsService';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await storeSettingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Gagal memuat pengaturan navbar:', error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const data = settings || {
    storeName: 'Yuna Florist Adiluwih',
    whatsappNumber: '085768300253',
    instagram: 'yunafloristadiluwih',
    facebook: 'Yuna Florist Adiluwih',
    address: 'Adiluwih, Pringsewu, Lampung',
    openingHours: '08:00 - 20:00',
    description: 'Buket cantik untuk momen spesial Anda.',
    logoUrl: ''
  };

  const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Katalog', path: '/catalog' },
  { name: 'Bantu Pilih', path: '/help-me-choose' },
];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-pink-dark/10 py-3"
          : "bg-brand-cream py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <div className="w-10 h-10 bg-brand-pink rounded-lg flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={data.storeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Flower2 className="text-brand-pink-dark w-6 h-6" />
            )}
          </div>

          <div className="min-w-0">
            <span className="block font-serif text-base md:text-lg font-bold leading-none tracking-tight text-brand-sage truncate">
              {data.storeName}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-brand-pink-dark font-semibold">
              Florist & Gift
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-pink-dark",
                location.pathname === link.path
                  ? "text-brand-pink-dark"
                  : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}

        <Link
          to="/cart"
          className="relative bg-brand-sage text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-sage/90 transition-colors shadow-sm flex items-center gap-2"
          >
          <ShoppingCart className="w-4 h-4" />
          Keranjang

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-brand-pink-dark text-white text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        </div>

        {/* Mobile Right */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/cart"
            className="p-2.5 bg-brand-sage text-white rounded-lg shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>

          <button
            className="p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-brand-pink-dark/10 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-base font-semibold p-3 rounded-lg transition-all",
                  location.pathname === link.path
                    ? "bg-brand-pink text-brand-pink-dark"
                    : "text-slate-600 hover:bg-slate-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/orders"
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all shadow-sm",
                location.pathname === "/orders"
                  ? "bg-brand-pink-dark text-white"
                  : "bg-brand-pink text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Cek Pesanan</span>
            </Link>

            <Link
              to="/cart"
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all shadow-sm",
                location.pathname === "/cart"
                  ? "bg-brand-sage text-white"
                  : "bg-brand-sage text-white hover:bg-brand-sage/90"
              )}
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Keranjang</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}