'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

const COUPONS: Record<string, number> = { GIFT20: 200, DIWALI: 500, FIRST100: 100 };

export default function CartPage() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isLoggedIn, token } = useUserStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const applyCoupon = () => {
    const d = COUPONS[coupon.toUpperCase()];
    if (d) { setDiscount(d); setCouponMsg(`✓ Applied! ₹${d} off`); }
    else { setDiscount(0); setCouponMsg('✗ Invalid coupon'); }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    setLoading(true);
    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          shippingAddress: { name: 'Customer', phone: '9999999999', address: '123 Street', city: 'Bhopal', pincode: '462001', state: 'MP' },
          paymentMethod: 'razorpay',
          couponCode: coupon,
        }),
      });
      const order = await orderRes.json();
      const rzpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: totalAmount - discount, orderId: order._id }),
      });
      const rzp = await rzpRes.json();
      const options = {
        key: rzp.key, amount: rzp.amount, currency: rzp.currency,
        name: 'Giftura', description: 'Gift Shop Payment', order_id: rzp.razorpayOrderId,
        handler: async (response: any) => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...response, orderId: order._id }),
          });
          clearCart();
          router.push(`/orders/${order._id}`);
        },
        theme: { color: '#E8465A' },
      };
      const Razorpay = (window as any).Razorpay;
      if (Razorpay) new Razorpay(options).open();
      else alert('Please add Razorpay script to the page head.');
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="text-6xl">🛒</div>
        <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
        <button onClick={() => router.push('/products')}
          className="bg-rose-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
          Browse Gifts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🎁</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-rose-500 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-gray-500 hover:text-rose-500 w-5 text-center font-medium">−</button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-gray-500 hover:text-rose-500 w-5 text-center font-medium">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)}
                    className="text-xs text-gray-400 hover:text-rose-500 transition-colors">Remove</button>
                </div>
              </div>
              <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
            {discount > 0 && <div className="flex justify-between text-rose-500"><span>Discount</span><span>−₹{discount}</span></div>}
          </div>
          <div className="flex gap-2 mb-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (GIFT20)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-400" />
            <button onClick={applyCoupon} className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium">Apply</button>
          </div>
          {couponMsg && <p className={`text-xs mb-3 ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-rose-500'}`}>{couponMsg}</p>}
          <div className="border-t border-gray-100 pt-3 mb-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span><span>₹{(totalAmount - discount).toLocaleString()}</span>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
            {loading ? 'Processing...' : '💳 Pay with Razorpay'}
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">🔒 Secured & SSL Encrypted</p>
        </div>
      </div>
    </div>
  );
}
