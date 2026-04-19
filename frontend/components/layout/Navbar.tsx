'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount)();
  const { user, isLoggedIn, logout } = useUserStore();

  // Wait until component is mounted on client before showing cart count
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          🎁 Giftura
        </Link>
        <div className="hidden md:flex items-center gap-5 flex-1">
          <Link href="/products" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">Products</Link>
          <Link href="/products?occasion=birthday" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">Birthday</Link>
          <Link href="/products?occasion=anniversary" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">Anniversary</Link>
          <Link href="/products?occasion=festive" className="text-sm text-gray-600 hover:text-rose-500 transition-colors">Festive</Link>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-xl">🛒</span>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
          {mounted && isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : mounted ? (
            <Link href="/login" className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}