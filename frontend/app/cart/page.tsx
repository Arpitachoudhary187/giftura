'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

const COUPONS: Record<string, number> = { GIFT20: 200, DIWALI: 500, FIRST100: 100 };

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isLoggedIn, token } = useUserStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const applyCoupon = () => {
    const d = COUPONS[coupon.toUpperCase()];
    if (d) { setDiscount(d); setCouponMsg(`✓ Applied! ₹${d} off`); }
    else { setDiscount(0); setCouponMsg('✗ Invalid coupon'); }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    if (items.length === 0) { alert('Your cart is empty!'); return; }

    setLoading(true);

    try {
      // Load Razorpay script dynamically
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert('Failed to load Razorpay. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Place order in our backend
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress: {
              name: 'Customer',
              phone: '9999999999',
              address: '123 Street',
              city: 'Bhopal',
              pincode: '462001',
              state: 'MP',
            },
            paymentMethod: 'razorpay',
            couponCode: coupon || undefined,
          }),
        }
      );

      const order = await orderRes.json();
      if (!order._id) {
        alert('Failed to create order. Please login again.');
        setLoading(false);
        return;
      }

      // Step 2: Create Razorpay order
      const rzpRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount - discount,
            orderId: order._id,
          }),
        }
      );

      const rzpData = await rzpRes.json();

      // Step 3: Open Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        currency: 'INR',
        name: 'Giftura',
        description: 'Gift Shop Payment',
        order_id: rzpData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/payment/razorpay/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order._id,
                }),
              }
            );
            const verify = await verifyRes.json();
            if (verify.success) {
              clearCart();
              router.push(`/orders/${order._id}`);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch {
            alert('Verification error. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@giftura.com',
          contact: '9999999999',
        },
        theme: { color: '#E8465A' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzpInstance.open();

    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Something went wrong: ' + err.message);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="text-6xl">🛒</div>
        <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
        <button
          onClick={() => router.push('/products')}
          className="bg-rose-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
        >
          Browse Gifts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Your Cart ({items.length} item{items.length > 1 ? 's' : ''})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <span className="text-2xl">🎁</span>
                }
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-rose-500 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-gray-500 hover:text-rose-500 w-5 text-center font-medium"
                    >−</button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-gray-500 hover:text-rose-500 w-5 text-center font-medium"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
                  >Remove</button>
                </div>
              </div>
              <p className="font-bold text-gray-800 text-sm">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span><span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span><span className="text-green-600">Free</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Discount</span><span>−₹{discount}</span>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="flex gap-2 mb-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon (try GIFT20)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
            <button
              onClick={applyCoupon}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium"
            >Apply</button>
          </div>
          {couponMsg && (
            <p className={`text-xs mb-3 ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-rose-500'}`}>
              {couponMsg}
            </p>
          )}

          <div className="border-t border-gray-100 pt-3 mb-4">
            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>₹{(totalAmount - discount).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            {loading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">🔒 100% Secure Payment</p>

          {/* Test card info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-1">Test Card Details:</p>
            <p className="text-xs text-blue-600">Card: 4111 1111 1111 1111</p>
            <p className="text-xs text-blue-600">Expiry: 12/25  CVV: 123</p>
            <p className="text-xs text-blue-600">OTP: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}