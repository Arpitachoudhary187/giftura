'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  occasion: string[];
  isFeatured?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
      <div className="relative h-40 bg-amber-50 flex items-center justify-center">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">🎁</span>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Bestseller
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all
            ${wishlisted ? 'bg-rose-100 text-rose-500 opacity-100' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100'}`}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5">{product.occasion?.[0] || 'Any Occasion'}</p>
        <h3 className="text-sm font-medium text-gray-800 leading-tight mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-rose-500">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice.toLocaleString()}</span>
            )}
            <div className="text-xs text-amber-400 mt-0.5">
              {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))} ({product.reviewCount || 0})
            </div>
          </div>
          <button
            onClick={handleAdd}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
              ${added ? 'bg-green-500 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
          >
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
