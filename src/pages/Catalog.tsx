import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  ChevronRight,
  Flower2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadData() {
      try {
        const [allProducts, allCategories] = await Promise.all([
          productService.getProducts(),
          categoryService.getActiveCategories()
        ]);
        setProducts(allProducts);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading catalog', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.categoryName.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery]);

  const handleCategoryChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Katalog Buket Kami</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
           <Link to="/" className="hover:text-brand-pink-dark">Beranda</Link>
           <ChevronRight className="w-4 h-4" />
           <span className="text-brand-pink-dark">Katalog</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-pink-dark" /> Kategori
            </h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  "text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === 'all' ? "bg-brand-pink text-brand-pink-dark shadow-sm" : "hover:bg-slate-50 text-slate-500"
                )}
              >
                Semua Produk
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id!)}
                  className={cn(
                    "text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === cat.id ? "bg-brand-pink text-brand-pink-dark shadow-sm" : "hover:bg-slate-50 text-slate-500"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-pink/20 rounded-2xl p-6 border border-brand-pink-dark/10">
             <h4 className="font-serif font-bold text-brand-sage mb-2">Ingin Buket Custom?</h4>
             <p className="text-xs text-slate-500 leading-relaxed mb-4">Wujudkan buket impian Anda bersama kami. Chat admin sekarang!</p>
             <Link to="/help-me-choose" className="text-xs font-bold text-brand-pink-dark hover:underline flex items-center gap-1">
                Konsultasi Gratis <ChevronRight className="w-3 h-3" />
             </Link>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Controls Mobile & Search */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
             <div className="w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari produk impian Anda..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-pink-dark/10 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-pink-dark focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) searchParams.set('search', val);
                    else searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}
                />
             </div>
             
             <button 
                className="lg:hidden w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-brand-pink-dark/10 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 shadow-sm"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filter
             </button>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 font-medium">
              Menampilkan <span className="text-brand-pink-dark font-bold">{filteredProducts.length}</span> produk
            </p>
            {/* Sort Dropdown could go here */}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/50 animate-pulse rounded-xl aspect-[4/6]" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-brand-pink-dark/10">
               <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flower2 className="w-8 h-8 text-brand-pink-dark" />
               </div>
               <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h3>
               <p className="text-slate-400 text-sm max-w-xs mx-auto">
                 Maaf, kami tidak menemukan produk yang sesuai dengan kriteria Anda. Coba kata kunci lain atau hubungi admin.
               </p>
               <button 
                onClick={() => setSearchParams({})}
                className="mt-6 text-brand-pink-dark font-bold hover:underline"
               >
                 Hapus Semua Filter
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[70] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-serif text-xl font-bold text-slate-800">Filter Pilihan</h3>
                 <button onClick={() => setShowFilters(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-grow">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Kategori Buket</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => { handleCategoryChange('all'); setShowFilters(false); }}
                      className={cn(
                        "text-left px-5 py-4 rounded-xl text-base font-semibold transition-all border",
                        selectedCategory === 'all' ? "bg-brand-pink border-brand-pink-dark/30 text-brand-pink-dark shadow-sm" : "border-slate-100 text-slate-500"
                      )}
                    >
                      Semua Produk
                    </button>
                    {categories.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => { handleCategoryChange(cat.id!); setShowFilters(false); }}
                        className={cn(
                          "text-left px-5 py-4 rounded-xl text-base font-semibold transition-all border",
                          selectedCategory === cat.id ? "bg-brand-pink border-brand-pink-dark/30 text-brand-pink-dark shadow-sm" : "border-slate-100 text-slate-500"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="mt-auto space-y-4 pt-6">
                 <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold"
                 >
                   Terapkan Filter
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
