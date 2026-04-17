'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

const STATUS_STEPS = ['placed', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = { placed: 'Order Placed', processing: 'Processing', shipped: 'In Transit', delivered: 'Delivered' };
const STATUS_ICONS: Record<string, string> = { placed: '📋', processing: '📦', shipped: '🚚', delivered: '✅' };

export default function OrderPage() {
  const { id } = useParams();
  const { token } = useUserStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order || order.message) return <div className="min-h-screen flex items-center justify-center text-gray-500">Order not found. Please login first.</div>;

  const currentIndex = STATUS_STEPS.indexOf(order.currentStatus);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🎉</span>
        <div>
          <p className="font-semibold text-green-800">Order confirmed!</p>
          <p className="text-sm text-green-600">Track your gift delivery below.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-xs text-gray-400 mb-1">ORDER #{String(order._id).slice(-8).toUpperCase()}</p>
        <h1 className="text-lg font-bold text-gray-900 mb-1">
          {order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
        </h1>
        <p className="text-sm text-gray-500 mb-6">₹{order.totalAmount?.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-2">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all
                ${i < currentIndex ? 'bg-green-100' : i === currentIndex ? 'bg-rose-100 ring-2 ring-rose-400 ring-offset-2' : 'bg-gray-100'}`}>
                {STATUS_ICONS[step]}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentIndex ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-6">
          {STATUS_STEPS.map((s) => (
            <span key={s} className={s === order.currentStatus ? 'text-rose-500 font-medium' : ''}>{STATUS_LABELS[s]}</span>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Tracking History</h2>
        <div className="space-y-0">
          {[...(order.trackingHistory || [])].reverse().map((event: any, i: number) => (
            <div key={i} className="flex gap-4 pb-4 relative">
              {i < (order.trackingHistory?.length - 1) && (
                <div className="absolute left-3 top-6 bottom-0 w-px bg-gray-100" />
              )}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs z-10
                ${i === 0 ? 'bg-rose-100 border-2 border-rose-400' : 'bg-gray-100 border border-gray-200'}`}>
                {i === 0 ? '●' : '○'}
              </div>
              <div>
                <p className={`text-sm font-medium ${i === 0 ? 'text-rose-600' : 'text-gray-800'}`}>
                  {STATUS_LABELS[event.status] || event.status}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{event.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
