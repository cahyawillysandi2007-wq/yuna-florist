import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flower2, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Search,
  RefreshCw,
  Gift,
  Heart,
  Smile,
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const steps = [
  {
    id: 'event',
    title: 'Untuk momen apa buket ini?',
    description: 'Kami akan menyesuaikan tema bunga dengan acara Anda.',
    options: [
      { id: 'Wisuda', icon: <Flower2 />, label: 'Wisuda' },
      { id: 'Ulang Tahun', icon: <Gift />, label: 'Ulang Tahun' },
      { id: 'Anniversary', icon: <Heart />, label: 'Anniversary' },
      { id: 'Hadiah', icon: <Smile />, label: 'Hadiah' },
      { id: 'Lainnya', icon: <Sparkles />, label: 'Acara Lainnya' },
    ]
  },
  {
    id: 'budget',
    title: 'Berapa anggaran (budget) Anda?',
    description: 'Bantu kami menemukan pilihan harga yang paling pas.',
    options: [
      { id: '< 50k', label: 'Di bawah Rp50.000' },
      { id: '50k - 100k', label: 'Rp50.000 - Rp100.000' },
      { id: '100k - 200k', label: 'Rp100.000 - Rp200.000' },
      { id: '> 200k', label: 'Diatas Rp200.000' },
    ]
  },
  {
    id: 'type',
    title: 'Jenis buket apa yang disukai?',
    description: 'Pilih tipe dasar buket yang Anda inginkan.',
    options: [
      { id: 'Bunga', label: 'Buket Bunga' },
      { id: 'Snack', label: 'Buket Snack' },
      { id: 'Uang', label: 'Buket Uang' },
      { id: 'Boneka', label: 'Buket Boneka' },
      { id: 'Custom', label: 'Custom Bebas' },
    ]
  },
  {
    id: 'color',
    title: 'Warna favorit atau tema warna?',
    description: 'Warna akan memberikan karakter pada buket Anda.',
    options: [
      { id: 'Pink', label: 'Pink Pastel' },
      { id: 'Putih', label: 'Putih Bersih' },
      { id: 'Merah', label: 'Merah Berani' },
      { id: 'Ungu', label: 'Ungu Cantik' },
      { id: 'Biru', label: 'Biru Tenang' },
      { id: 'Bebas', label: 'Warna Bebas' },
    ]
  }
];

export default function HelpMeChoose() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionId: string) => {
    const stepId = steps[currentStep].id;
    setSelections(prev => ({ ...prev, [stepId]: optionId }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      findRecommendations();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const findRecommendations = async () => {
    setLoading(true);
    setIsFinished(true);
    try {
      const allProducts = await productService.getProducts();
      // Simple filtering logic based on selections
      let results = allProducts.filter(p => {
        const matchEvent = p.eventTags?.includes(selections.event);
        const matchBudget = p.budgetRange === selections.budget;
        const matchType = p.categoryName.toLowerCase().includes(selections.type.toLowerCase()) || p.name.toLowerCase().includes(selections.type.toLowerCase());
        const matchColor = p.dominantColor === selections.color || selections.color === 'Bebas';
        
        // Return products that match at least 2 criteria for broad results
        let score = 0;
        if (matchEvent) score += 2;
        if (matchBudget) score += 1;
        if (matchType) score += 2;
        if (matchColor) score += 1;
        
        return score >= 2;
      });

      // Sort by score if we had one, or just take top matches
      setRecommendations(results.slice(0, 4));
    } catch (error) {
      console.error('Error finding recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelections({});
    setIsFinished(false);
    setRecommendations([]);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[70vh]">
      {!isFinished ? (
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-2 flex-grow rounded-full transition-all duration-500",
                  idx <= currentStep ? "bg-brand-pink-dark" : "bg-brand-pink"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-brand-pink-dark/5"
            >
              <div className="mb-10">
                <span className="text-[10px] font-bold text-brand-pink-dark uppercase tracking-widest mb-2 block">
                  Langkah {currentStep + 1} dari {steps.length}
                </span>
                <h2 className="font-serif text-3xl font-bold text-slate-800 mb-2 leading-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-slate-400 text-sm italic">{steps[currentStep].description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {steps[currentStep].options.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-brand-pink-dark/30 hover:bg-brand-pink transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                       {opt.icon && <div className="text-brand-pink-dark">{opt.icon}</div>}
                       <span className="font-bold text-slate-600 group-hover:text-brand-pink-dark">{opt.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-brand-pink-dark group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="mt-10 flex items-center gap-2 text-slate-400 hover:text-brand-pink-dark transition-colors font-bold text-sm"
                >
                  <ChevronLeft className="w-5 h-5" /> Sebelumnya
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex w-20 h-20 bg-brand-pink rounded-full items-center justify-center text-brand-pink-dark mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-slate-800 mb-4">Rekomendasi Terbaik Kami</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Berdasarkan pilihan Anda, berikut adalah beberapa buket yang kami rasa sangat cocok untuk momen tersebut.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/50 animate-pulse rounded-2xl aspect-[4/6]" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center shadow-soft border border-dashed border-brand-pink-dark/20 mb-16">
               <h3 className="font-serif text-2xl font-bold text-slate-800 mb-4">Maaf, Stok Terbatas</h3>
               <p className="text-slate-500 max-w-md mx-auto leading-relaxed italic mb-8">
                 Saat ini kami belum memiliki stok buket yang benar-benar pas dengan kriteria spesifik Anda. Namun, tenang saja! Kami bisa membuatkan secara <strong>Custom</strong>.
               </p>
               <Link 
                to="/catalog"
                className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-900 transition-all inline-block"
               >
                 Lihat Katalog Populer
               </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-pink-dark font-bold underline transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Ulangi Pencarian
            </button>
            <span className="hidden sm:inline text-slate-200">|</span>
            <a 
              href="https://wa.me/6285768300253?text=Halo Yuna Florist, saya ingin tanya buket custom dong." 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-pink-dark text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-100 hover:scale-105 transition-all"
            >
              Konsultasi Langsung via WA
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
