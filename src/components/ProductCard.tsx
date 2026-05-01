import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-lg border border-brand-pink-dark/10 overflow-hidden shadow-soft flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1522673607200-16488352475b?q=80&w=800&auto=format&fit=crop'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.label && (
          <div className="absolute top-3 left-3 bg-brand-pink-dark text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
            {product.label}
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
             <span className="bg-slate-800 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Habis</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <Tag className="w-3 h-3 text-brand-sage" />
          <span className="text-[10px] text-brand-sage font-semibold uppercase tracking-wider">{product.categoryName}</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="block group-hover:text-brand-pink-dark transition-colors mb-2">
          <h3 className="font-serif font-bold text-slate-800 leading-tight line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-brand-pink-dark font-bold text-lg">{formatPrice(product.price)}</p>
          <Link 
            to={`/product/${product.id}`}
            className="w-10 h-10 border border-brand-pink-dark/20 flex items-center justify-center rounded-lg text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
