'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

const OCCASIONS = ['Birthday', 'Anniversary', 'Festive', 'Wedding'];

export default function RecommendationPanel() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState('Birthday');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { token } = useUserStore();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/recommendations?occasion=${selected}&budget=5000`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setProducts(data.recommendations || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selected, token]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-rose-500 text-lg">✦</span>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Picks For You</h2>
            <p className="text-xs text-gray-400">Personalized recommendations</p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => setSelected(o)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all border
                ${selected === o ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600 hover:border-rose-300'}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-6">No recommendations found. Try seeding the database!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.slice(0, 4).map((p: any, i: number) => (
            <div key={p._id || i} className="bg-amber-50 rounded-xl p-3 flex flex-col gap-2">
              <div className="h-14 flex items-center justify-center text-3xl">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-full h-full object-cover rounded-lg" alt={p.name} />
                ) : '🎁'}
              </div>
              <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-rose-500">₹{p.price?.toLocaleString()}</span>
                <button
                  onClick={() => addItem({ productId: p._id, name: p.name, price: p.price, image: p.images?.[0] || '' })}
                  className="text-xs bg-rose-500 text-white px-2 py-1 rounded-lg hover:bg-rose-600 transition-colors"
                >
                  + Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
