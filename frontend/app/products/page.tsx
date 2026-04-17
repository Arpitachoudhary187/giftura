'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';

const OCCASIONS = ['All', 'Birthday', 'Anniversary', 'Festive', 'Wedding'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [occasion, setOccasion] = useState('All');
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(occasion !== 'All' && { occasion: occasion.toLowerCase() }),
      sort,
      ...(maxPrice && { maxPrice }),
      page: String(page),
      limit: '12',
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setTotal(data.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [occasion, sort, maxPrice, page]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Gifts</h1>
          <p className="text-sm text-gray-500 mt-1">{total} products found</p>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-rose-400 bg-white">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
            <p className="text-sm font-semibold text-gray-800 mb-3">Occasion</p>
            {OCCASIONS.map((occ) => (
              <button key={occ} onClick={() => { setOccasion(occ); setPage(1); }}
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg mb-1 transition-colors
                  ${occasion === occ ? 'bg-rose-50 text-rose-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                {occ}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">Max Budget</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">₹</span>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-rose-400" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Mobile occasion filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 md:hidden">
            {OCCASIONS.map((occ) => (
              <button key={occ} onClick={() => setOccasion(occ)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs border transition-colors
                  ${occasion === occ ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                {occ}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">🎁</div>
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <button onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 bg-white">← Prev</button>
                )}
                {products.length === 12 && (
                  <button onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600">Next →</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
