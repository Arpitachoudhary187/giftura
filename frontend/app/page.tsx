'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import RecommendationPanel from '@/components/ai/RecommendationPanel';
import ChatBot from '@/components/ai/ChatBot';
import VoiceSearch from '@/components/ai/VoiceSearch';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=8&sort=rating`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Gifts That Feel Personal
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            AI-powered recommendations • Voice search • Same-day delivery
          </p>
          <div className="flex justify-center">
            <VoiceSearch />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['🎂 Birthday', '💍 Anniversary', '🪔 Festive', '💒 Wedding', '🎓 Graduation'].map((cat) => (
            <a key={cat} href={`/products?occasion=${cat.split(' ')[1].toLowerCase()}`}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 hover:border-rose-400 hover:text-rose-500 transition-all">
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="max-w-6xl mx-auto px-6 pb-6">
        <RecommendationPanel />
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Popular Gifts</h2>
          <a href="/products" className="text-rose-500 text-sm hover:underline">View all →</a>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎁</p>
            <p className="text-gray-500 mb-2">No products yet!</p>
            <p className="text-gray-400 text-sm">Run this command in the backend terminal:</p>
            <code className="text-xs bg-gray-100 px-3 py-1.5 rounded mt-2 inline-block font-mono">npm run seed</code>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <ChatBot />
    </main>
  );
}
