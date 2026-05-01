import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stock = product.stock ?? 0;

  const stockStatus =
    stock <= 0
      ? {
          text: 'Habis',
          className: 'text-red-600 bg-red-50 border-red-100'
        }
      : stock <= 3
      ? {
          text: 'Stok Menipis',
          className: 'text-orange-600 bg-orange-50 border-orange-100'
        }
      : {
          text: 'Ready',
          className: 'text-green-600 bg-green-50 border-green-100'
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl border border-brand-pink-dark/10 overflow-hidden shadow-soft flex flex-col h-full max-w-sm mx-auto w-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-slate-50"
      >
        <img
          src={
            product.imageUrl ||
            'https://images.unsplash.com/photo-1522673607200-16488352475b?q=80&w=800&auto=format&fit=crop'
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.labels && product.labels.length > 0 && (
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
            {product.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="bg-brand-pink-dark text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {stock <= 0 && (
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              Habis
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3.5 h-3.5 text-brand-sage shrink-0" />
          <span className="text-[10px] text-brand-sage font-bold uppercase tracking-wider line-clamp-1">
            {product.categoryName}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="block group-hover:text-brand-pink-dark transition-colors"
        >
          <h3 className="font-serif font-bold text-slate-800 leading-snug text-lg line-clamp-2 min-h-[52px]">
            {product.name}
          </h3>
        </Link>

        <div
          className={cn(
            'mt-3 inline-flex w-fit items-center border px-2.5 py-1 rounded-md text-[10px] font-bold uppercase',
            stockStatus.className
          )}
        >
          {stockStatus.text}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-brand-pink-dark font-bold text-lg">
            {formatPrice(product.price)}
          </p>

          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 border border-brand-pink-dark/20 flex items-center justify-center rounded-lg text-brand-pink-dark hover:bg-brand-pink-dark hover:text-white transition-all shadow-sm shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}